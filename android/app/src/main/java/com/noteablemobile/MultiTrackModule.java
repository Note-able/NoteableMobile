package com.noteable.react.modules.multitrack;


import android.media.MediaPlayer;
import android.util.Log;

import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;

import android.media.MediaExtractor;
import android.media.MediaFormat;
import android.media.MediaCodec;
import android.media.MediaCodecInfo;
import android.media.MediaCodecList;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.io.IOException;
import java.lang.Thread;
import java.io.PipedInputStream;
import java.io.PipedOutputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.BrokenBarrierException;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Collections;

public class MultiTrackModule extends ReactContextBaseJavaModule {
  ReactApplicationContext context;
  HashMap<String, String> mediaFiles = new HashMap<String, String>();
  List<Thread> mediaWorkers;
  Map<Integer, ByteBuffer> trackBuffers;
  ArrayList<PipedInputStream> trackInputStreams;
  ArrayList<PipedOutputStream> trackOutputStreams;
  AudioTrack player = null;

  CyclicBarrier barrier;
  boolean ready = false;

  public MultiTrackModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.context = reactContext;
  }

  @Override
  public String getName() {
    return "MultiTrack";
  }

  @ReactMethod
  public void AddTrack(final String id, final String fileName) {
    this.mediaFiles.put(id, fileName);
  }

  @ReactMethod
  public void RemoveTrack(final String id) {
    this.mediaFiles.remove(id);
  }

  @ReactMethod
  public void Stop() {
    if (player == null)
      return;

    player.stop();
  }

  @ReactMethod
  public void Start() {
    Log.v("RCT_DBG" ,"Starting real time mix");
    // use sample rate of first file for audio track
    new Thread(new Runnable() {
      @Override
      public void run() {
        try {
          int trackSampleRate = 0;
          ArrayList<String> fileNames = new ArrayList<String>(MultiTrackModule.this.mediaFiles.values());

          MultiTrackModule.this.mediaWorkers = Collections.synchronizedList(new ArrayList<Thread>());
          MultiTrackModule.this.trackBuffers = Collections.synchronizedMap(new HashMap<Integer, ByteBuffer>());
          MultiTrackModule.this.trackInputStreams = new ArrayList<PipedInputStream>();
          MultiTrackModule.this.trackOutputStreams = new ArrayList<PipedOutputStream>();

          MultiTrackModule.this.barrier = new CyclicBarrier(MultiTrackModule.this.mediaFiles.size());
          ArrayList<MediaCodec> mediaCodecs = new ArrayList<MediaCodec>();
          for (int i = 0; i < MultiTrackModule.this.mediaFiles.size(); i++) {
            String fileName = fileNames.get(i);
            PipedInputStream in = new PipedInputStream();
            PipedOutputStream out = new PipedOutputStream(in);
            Thread mediaCodecThread = new Thread(new MediaCodecWorker(fileName, out, i));
            MultiTrackModule.this.trackInputStreams.add(in);
            mediaWorkers.add(mediaCodecThread);
            mediaCodecThread.start();

            if (i == 0) {
              MediaExtractor extractor = new MediaExtractor();
              extractor.setDataSource(fileName);
              trackSampleRate = extractor.getTrackFormat(0).getInteger(MediaFormat.KEY_SAMPLE_RATE);
              extractor.release();
            }
          }

          int bufferSize = AudioTrack.getMinBufferSize(trackSampleRate, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT);
          MultiTrackModule.this.player = new AudioTrack(AudioManager.STREAM_MUSIC, trackSampleRate, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT, bufferSize, AudioTrack.MODE_STREAM);

          Log.v("RCT_DBG" ,"Writing audio track with sample rate " + trackSampleRate);
          MultiTrackModule.this.player.play();

          boolean processing = true;
          int trackBufferCount = MultiTrackModule.this.trackBuffers.size();
          short[] audioBuffer = new short[bufferSize];
          int currentBufferIndex = 0;
          while (processing) {
            boolean dataAvailable = true;
            while (dataAvailable) {
              int total = 0;
              short normalizeFactor = 0;
              dataAvailable = false;

              ArrayList<PipedInputStream> toRemove = new ArrayList<PipedInputStream>();
              for (PipedInputStream in : MultiTrackModule.this.trackInputStreams) {
                byte[] shortBuffer = new byte[2];
                int data = in.read(shortBuffer, 0, 2);
                if (data != -1) {
                  if (data == 2)
                    total += MultiTrackModule.this.convertBytesToShort(shortBuffer);
                  else
                    total += (shortBuffer[0] & 0xFF);

                  dataAvailable = true;
                  normalizeFactor++;
                } else {
                  toRemove.add(in);
                  in.close();
                }
              }

              if (toRemove.size() > 0) {
                for (int i = 0; i < toRemove.size(); i++) {
                  MultiTrackModule.this.trackInputStreams.remove(toRemove.get(i));
                }
                if (MultiTrackModule.this.trackInputStreams.size() == 0)
                  processing = false;
              }

              if (normalizeFactor == 0);
                normalizeFactor = 1;

              int normalizedValue = (total / normalizeFactor);
              if( normalizedValue > Short.MAX_VALUE )
                normalizedValue = Short.MAX_VALUE;
              if( normalizedValue < Short.MIN_VALUE )
                normalizedValue = Short.MIN_VALUE;
              audioBuffer[currentBufferIndex] = (short)normalizedValue;
              currentBufferIndex++;
              if (currentBufferIndex == bufferSize) {
                int written = MultiTrackModule.this.player.write(audioBuffer, 0, bufferSize);
                audioBuffer = new short[bufferSize];
                currentBufferIndex = 0;
              }
            }
          }
          MultiTrackModule.this.player.flush();
        } catch (IOException e) {
          Log.d("RCT_DBG", e.getMessage());
        }
      }
    }).start();
  }

  private short convertBytesToShort(byte[] bytes) {
    ByteBuffer bb = ByteBuffer.allocate(2);
    bb.order(ByteOrder.LITTLE_ENDIAN);
    bb.put(bytes[0]);
    bb.put(bytes[1]);
    return bb.getShort(0);
  }

  class MediaCodecWorker implements Runnable {
    MediaCodec m_mediaCodec;
    MediaFormat m_trackFormat;
    MediaExtractor m_extractor;
    PipedOutputStream m_out;
    PipedInputStream m_in;

    MediaCodecWorker (String fileName, PipedOutputStream out, int index) throws IOException {
      MediaExtractor extractor = new MediaExtractor();
      extractor.setDataSource(fileName);
      m_extractor = extractor;
      m_out = out;
      m_trackFormat = extractor.getTrackFormat(0);
      MediaCodecList mediaCodecList = new MediaCodecList(MediaCodecList.REGULAR_CODECS);
      m_mediaCodec = MediaCodec.createByCodecName(mediaCodecList.findDecoderForFormat(m_trackFormat));
    }

    MediaCodecWorker (String fileName, PipedInputStream in) throws IOException {
      m_extractor = null;
      m_in = in;
      m_trackFormat = MediaFormat.createAudioFormat(MediaFormat.MIMETYPE_AUDIO_AAC, 44100, 1);
      MediaCodecList mediaCodecList = new MediaCodecList(MediaCodecList.REGULAR_CODECS);
      m_mediaCodec = MediaCodec.createByCodecName(mediaCodecList.findEncoderForFormat(m_trackFormat));
    }

    public void run() {
      m_trackFormat.setInteger(MediaFormat.KEY_AAC_PROFILE, MediaCodecInfo.CodecProfileLevel.AACObjectLC);
      m_mediaCodec.configure(m_trackFormat, null, null, 0);
      m_mediaCodec.start();

      try {
        boolean sawInputEOS = false;
        m_extractor.selectTrack(0);
        // wait here for processing
        MultiTrackModule.this.barrier.await();
        while (!sawInputEOS) {
          ByteBuffer[] inputBuffers = m_mediaCodec.getInputBuffers();
          ByteBuffer[] outputBuffers = m_mediaCodec.getOutputBuffers();
          int inputBufferIndex = m_mediaCodec.dequeueInputBuffer(-1);
          // read input buffer

          if (inputBufferIndex >= 0) {
            ByteBuffer inputBuffer = inputBuffers[inputBufferIndex];
            inputBuffer.clear();
            int sampleSize = m_extractor.readSampleData(inputBuffer, 0);
            long presentationTimeUs = 0;
            if (sampleSize < 0) {
              sawInputEOS = true;
              sampleSize = 0;
            } else {
              presentationTimeUs = m_extractor.getSampleTime();
            }

            m_mediaCodec.queueInputBuffer(inputBufferIndex, 0, sampleSize, presentationTimeUs, sawInputEOS ? MediaCodec.BUFFER_FLAG_END_OF_STREAM : 0);
            if (!sawInputEOS) {
              m_extractor.advance();
            }
          }

          // get output buffer
          MediaCodec.BufferInfo bufferInfo = new MediaCodec.BufferInfo();
          int outputBufferIndex = m_mediaCodec.dequeueOutputBuffer(bufferInfo,0);
          while (outputBufferIndex >= 0) {
              ByteBuffer outputBuffer = outputBuffers[outputBufferIndex];
              byte[] rawData = new byte[bufferInfo.size];
              outputBuffer.get(rawData);
              m_out.write(rawData, 0, rawData.length);
              m_out.flush();

              m_mediaCodec.releaseOutputBuffer(outputBufferIndex, false);
              outputBufferIndex = m_mediaCodec.dequeueOutputBuffer(bufferInfo, 0);
          }
        }
        m_out.close();
      } catch (BrokenBarrierException e) {
        Log.d("RCT_DBG", e.getMessage());
      } catch (InterruptedException e) {
        Log.d("RCT_DBG", e.getMessage());
      } catch(IOException e) {
        Log.d("RCT_DBG", e.getMessage());
      }

      m_mediaCodec.stop();
      m_mediaCodec.release();
    }
  }

  class MediaWorker implements Runnable {
    final MediaPlayer m_mediaPlayer;
    MediaWorker(MediaPlayer mediaPlayer) {
      m_mediaPlayer = mediaPlayer;
    }

    public void run() {
      Log.d("RCT_DBG", "Running");
      try {
        MultiTrackModule.this.barrier.await();
      } catch (InterruptedException e) {
        Log.d("RCT_DBG", e.getMessage());
      } catch (BrokenBarrierException e) {
        Log.d("RCT_DBG", e.getMessage());
      }
      Log.d("RCT_DBG", "Playing");
      try {
        m_mediaPlayer.start();
      } catch (Throwable th){
        Log.v("ErrorInRunnable", th.toString());
      }
    }
  }
}
