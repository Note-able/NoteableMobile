package com.noteable.react.modules.metronome;

import com.noteablemobile.R;

import android.media.SoundPool;
import android.media.SoundPool.Builder;
import android.media.SoundPool.OnLoadCompleteListener;
import android.media.AudioAttributes;
import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.util.Map;
import java.util.HashMap;
import java.util.Timer;
import java.util.TimerTask;

public class MetronomeModule extends ReactContextBaseJavaModule {
  ReactApplicationContext context;
  int metronomeCount;
  private Timer metronomeTimer;
  SoundPool soundPool = null;
  int soundId;

  public MetronomeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.context = reactContext;
  }

  @Override
  public String getName() {
    return "Metronome";
  }

  @ReactMethod
  public void start(final Integer countLimit, final Integer bpm, final Integer beatsInBar, final Boolean alwaysOn, final Callback callback) {
    this.soundPool = new SoundPool.Builder()
      .setAudioAttributes(new AudioAttributes.Builder()
        .setUsage(AudioAttributes.USAGE_GAME)
        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
        .build())
      .build();

    this.metronomeCount = 0;
    this.soundPool.setOnLoadCompleteListener(new OnLoadCompleteListener() {
      @Override
      public synchronized void onLoadComplete(final SoundPool loadedSoundPool, final int soundId, int status) {
        MetronomeModule.this.metronomeTimer = new Timer();
        MetronomeModule.this.metronomeTimer.scheduleAtFixedRate(new TimerTask() {
          @Override
          public void run(){
            if (MetronomeModule.this.metronomeCount == countLimit) {
              callback.invoke();
              if (!alwaysOn) {
                this.cancel();
              } else {
                loadedSoundPool.play(soundId, 1, 1, 0, 0, 1);
                MetronomeModule.this.metronomeCount += 1;
              }
            } else {
              if (MetronomeModule.this.metronomeCount % beatsInBar == 0) {
                // full volume only on the first beat in the bar
                loadedSoundPool.play(soundId, 1, 1, 0, 0, 1);
              } else {
                loadedSoundPool.play(soundId, 0.5f, 0.5f, 0, 0, 1);
              }
              MetronomeModule.this.metronomeCount += 1;
            }
          }
        }, 0, 60000 / bpm);
      }
    });
    this.soundPool.load(context, R.raw.metronome, 0);
  }

  @ReactMethod
  public void stop() {
    if (this.metronomeTimer != null) {
      this.metronomeTimer.cancel();
      this.soundPool.release();
    }
  }
}