import Sound from 'react-native-sound';
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import {
  DeviceEventEmitter,
} from 'react-native';
import { PlayerActionTypes } from './ActionTypes.js';
import { logCustomToFabric } from '../util';

const {
  startPlayerTypes,
  togglePlayerTypes,
} = PlayerActionTypes;

export const startPlayer = recording => (
  (dispatch) => {
    dispatch({ type: startPlayerTypes.processing });
    if (recording.path !== '') {
      const reactNativeSound = new Sound(recording.path, '', (error) => {
        if (error) {
          return dispatch({ type: startPlayerTypes.error, error });
        }

        return dispatch({ type: startPlayerTypes.success, sound, recording });
      });
      const sound = {
        play: callback => (new Promise((resolve) => {
          reactNativeSound.play(callback);
          resolve();
        })),
        stop: reactNativeSound.stop,
        resume: reactNativeSound.resume,
        getCurrentTime: reactNativeSound.getCurrentTime,
        pause: reactNativeSound.pause,
        release: reactNativeSound.release,
      };
    } else {
      const sound = {
        play: callback => (new Promise((resolve, reject) => {
          ReactNativeAudioStreaming.play(recording.audioUrl, { showIniOSMediaCenter: true, showInAndroidNotifications: true });
          DeviceEventEmitter.addListener(
            'AudioBridgeEvent', (evt) => {
                // We just want meta update for song name
              if (evt.status === 'STOPPED') {
                callback();
              } else if (evt.status === 'PLAYING') {
                sound.duration = evt.duration;
                sound.currentTime = evt.progress;
                resolve();
              } else if (evt.status === 'ERROR') {
                if (sound.errorCount === 0) {
                  ReactNativeAudioStreaming.play(recording.audioUrl, { showIniOSMediaCenter: true, showInAndroidNotifications: true });
                } else {
                  reject();
                }
              }
            },
          );
        })),
        stop: ReactNativeAudioStreaming.stop,
        resume: ReactNativeAudioStreaming.resume,
        pause: ReactNativeAudioStreaming.pause,
        release: ReactNativeAudioStreaming.stop,
        getCurrentTime: callback => callback(sound.currentTime),
        errorCount: 0,
      };

      return dispatch({ type: startPlayerTypes.success, sound, recording });
    }
  }
);

export const togglePlayer = play => (dispatch => dispatch({ type: togglePlayerTypes, play }));
