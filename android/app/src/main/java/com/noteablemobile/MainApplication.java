package com.noteablemobile;

import android.app.Application;

/* Our modules */
import com.noteable.react.modules.metronome.MetronomePackage;
import com.noteable.react.modules.multitrack.MultiTrackPackage;

import com.crashlytics.android.Crashlytics;
import com.facebook.react.ReactApplication;
import com.audioStreaming.ReactNativeAudioStreamingPackage;
import com.smixx.fabric.FabricPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import io.fabric.sdk.android.Fabric;
import io.realm.react.RealmReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativeAudioStreamingPackage(),
            new FabricPackage(),
            new FBSDKPackage(mCallbackManager),
            new RealmReactPackage(),
            new VectorIconsPackage(),
            new RNSoundPackage(),
            new LinearGradientPackage(),
            new RNFetchBlobPackage(),
            new ReactNativeAudioPackage(),
            new MetronomePackage(),
            new MultiTrackPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
    SoLoader.init(this, /* native exopackage */ false);
    FacebookSdk.sdkInitialize(getApplicationContext());
  }

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }
}
