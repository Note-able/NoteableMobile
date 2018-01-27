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
import android.media.MediaMuxer;

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
import java.io.FileOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Arrays;
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
  FileOutputStream mixedFiledOutputStream;
  String mixedFiledOutputPath;
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
        MultiTrackModule.this.MixAudioCore(true);
      }
    }).start();
  }

  @ReactMethod
  public void WriteMixToFile(final String fileName) {
    Log.v("RCT_DBG" ,"Starting real time mix");
    // use sample rate of first file for audio track
    new Thread(new Runnable() {
      @Override
      public void run() {
        try {
          Log.v("RCT_DBG" ,"Writing mix to " + fileName);
          File file = new File(fileName + ".aac");
          if (file.exists())
            file.delete();
          
          file.createNewFile();
          MultiTrackModule.this.mixedFiledOutputStream = new FileOutputStream(file);
          MultiTrackModule.this.mixedFiledOutputPath = fileName + ".aac";
          MultiTrackModule.this.MixAudioCore(false);
        } catch (FileNotFoundException e) {
          Log.d("RCT_DBG", e.getMessage());
        } catch (IOException e) {
          Log.d("RCT_DBG", e.getMessage());
        } 
      }
    }).start();
  }

  private void MixAudioCore(boolean playAudio) {
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
        Thread mediaCodecThread = new Thread(new MediaCodecWorker(fileName, out));
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
      PipedOutputStream toEncoder  = new PipedOutputStream();
      if (playAudio) {
        MultiTrackModule.this.player = new AudioTrack(AudioManager.STREAM_MUSIC, trackSampleRate, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT, bufferSize, AudioTrack.MODE_STREAM);

        Log.v("RCT_DBG" ,"Writing audio track with sample rate " + trackSampleRate);
        MultiTrackModule.this.player.play();
      } else {
       new Thread(new MediaCodecEncoderWorker(MultiTrackModule.this.mixedFiledOutputStream, new PipedInputStream(toEncoder))).start();
      }

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
            if (playAudio) {
              int written = MultiTrackModule.this.player.write(audioBuffer, 0, bufferSize);
            } else {
              // write buffer to pipedoutput stream to encoder
              for (short audioShort : audioBuffer) {
                byte[] data = new byte[2];
                data[0] = (byte)(audioShort & 0xff);
                data[1] = (byte)((audioShort >> 8) & 0xff);
                toEncoder.write(data, 0, 2);
              }
            }
            audioBuffer = new short[bufferSize];
            currentBufferIndex = 0;
          }
        }
      }
      if (playAudio) {
        MultiTrackModule.this.player.flush();
      }
    } catch (IOException e) {
      Log.d("RCT_DBG", e.getMessage());
    }
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

    MediaCodecWorker(String fileName, PipedOutputStream out) throws IOException {
      MediaExtractor extractor = new MediaExtractor();
      extractor.setDataSource(fileName);
      m_extractor = extractor;
      m_out = out;
      m_trackFormat = extractor.getTrackFormat(0);

      MediaCodecList mediaCodecList = new MediaCodecList(MediaCodecList.REGULAR_CODECS);
      m_mediaCodec = MediaCodec.createByCodecName(mediaCodecList.findDecoderForFormat(m_trackFormat));
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
          int outputBufferIndex = m_mediaCodec.dequeueOutputBuffer(bufferInfo, 0);
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
      } catch (IOException e) {
        Log.d("RCT_DBG", e.getMessage());
      }

      m_mediaCodec.stop();
      m_mediaCodec.release();
    }
  }

  class MediaCodecEncoderWorker implements Runnable {
    MediaCodec m_mediaCodec;
    MediaFormat m_trackFormat;
    FileOutputStream m_out;
    PipedInputStream m_in;
    private final int SAMPLE_RATE = 22050;
    private final int BIT_RATE = 32000;
    private final int MAX_INPUT_SIZE = 276;

    MediaCodecEncoderWorker (FileOutputStream out, PipedInputStream in) throws IOException {
      m_in = in;
      m_out = out;
      m_trackFormat = MediaFormat.createAudioFormat(MediaFormat.MIMETYPE_AUDIO_AAC, SAMPLE_RATE, 1);
      m_mediaCodec = MediaCodec.createEncoderByType(MediaFormat.MIMETYPE_AUDIO_AAC);
      m_trackFormat = new MediaFormat();
      m_trackFormat.setString(MediaFormat.KEY_MIME, MediaFormat.MIMETYPE_AUDIO_AAC);
      m_trackFormat.setInteger(MediaFormat.KEY_BIT_RATE, BIT_RATE);
      m_trackFormat.setInteger(MediaFormat.KEY_CHANNEL_COUNT, 1);
      m_trackFormat.setInteger(MediaFormat.KEY_SAMPLE_RATE, SAMPLE_RATE);
      m_trackFormat.setInteger(MediaFormat.KEY_AAC_PROFILE, MediaCodecInfo.CodecProfileLevel.AACObjectLC);
      m_trackFormat.setInteger(MediaFormat.KEY_MAX_INPUT_SIZE, MAX_INPUT_SIZE);
      m_mediaCodec.configure(m_trackFormat, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE);
    }

    private void addADTStoPacket(byte[] packet, int packetLen) {
      int profile = 2;  //AAC LC
      int freqIdx = 7;  //44.1KHz
      int chanCfg = 1;  //CPE

      // fill in ADTS data - NOTE: Currently use same output as Audio Recoridng
      // 1 Channel, LC AAC,  22050 Sample rate and 32000 Bit rate.
      packet[0] = (byte)0xFF;
      packet[1] = (byte)0xF9;
      packet[2] = (byte)(((profile-1)<<6) + (freqIdx<<2) +(chanCfg>>2));
      packet[3] = (byte)(((chanCfg&3)<<6) + (packetLen>>11));
      packet[4] = (byte)((packetLen&0x7FF) >> 3);
      packet[5] = (byte)(((packetLen&7)<<5) + 0x1F);
      packet[6] = (byte)0xFC;
    }

    public void run() {
      m_mediaCodec.start();

      try {
        boolean sawInputEOS = false;
        long presentationTimeUs = 0;
        int audioTrackIdx = 0;
        int totalBytesRead = 0;

        while (!sawInputEOS) {
          ByteBuffer[] inputBuffers = m_mediaCodec.getInputBuffers();
          ByteBuffer[] outputBuffers = m_mediaCodec.getOutputBuffers();
          int inputBufferIndex = m_mediaCodec.dequeueInputBuffer(-1);
          // read input buffer

          if (inputBufferIndex >= 0) {
            ByteBuffer inputBuffer = inputBuffers[inputBufferIndex];
            inputBuffer.clear();
            byte[] byteArray = new byte[256];
            int sampleSize = m_in.read(byteArray, 0, 256);
            inputBuffer.put(Arrays.copyOfRange(byteArray, 0, sampleSize));

            if (sampleSize < 0) {
              sawInputEOS = true;
              sampleSize = 0;
            } else {
              presentationTimeUs = 1000000l * (totalBytesRead / 2) / SAMPLE_RATE;
              totalBytesRead += sampleSize;
            }

            m_mediaCodec.queueInputBuffer(inputBufferIndex, 0, sampleSize, 0, sawInputEOS ? MediaCodec.BUFFER_FLAG_END_OF_STREAM : 0);
          }

          // get output buffer
          MediaCodec.BufferInfo bufferInfo = new MediaCodec.BufferInfo();
          int outputBufferIndex = m_mediaCodec.dequeueOutputBuffer(bufferInfo,0);
          while (outputBufferIndex >= 0) {
              ByteBuffer outputBuffer = outputBuffers[outputBufferIndex];
              byte[] rawData = new byte[bufferInfo.size + 7];
              addADTStoPacket(rawData, bufferInfo.size + 7);
              outputBuffer.get(rawData, 7, bufferInfo.size);

              m_out.write(rawData, 0, rawData.length);
              m_out.flush();

              m_mediaCodec.releaseOutputBuffer(outputBufferIndex, false);
              outputBufferIndex = m_mediaCodec.dequeueOutputBuffer(bufferInfo, 0);
          }
        }
        m_out.close();
      } catch(IOException e) {
        Log.d("RCT_DBG", e.getMessage());
      }

      m_mediaCodec.stop();
      m_mediaCodec.release();
    }
  }
}
