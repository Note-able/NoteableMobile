import Sound from 'react-native-sound';
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import {
  DeviceEventEmitter,
} from 'react-native';
import { PlayerActionTypes } from './ActionTypes.js';


const {
  bufferCompleteType,
  startPlayerTypes,
  togglePlayerTypes,
} = PlayerActionTypes;

export const startPlayer = recording => (
  async (dispatch, getState) => {
    console.log('start palyer dispatched');
    const state = getState().PlayerReducer;
    if (state.sound != null && state.sound.stop != null) {
      state.sound.stop();
      state.sound.release();
    }

    if (recording.path !== '') {
      dispatch({ type: startPlayerTypes.processing, buffering: false });
      const reactNativeSound = new Sound(recording.path, '', (error) => {
        if (error) {
          return dispatch({ type: startPlayerTypes.error, error });
        }

        const sound = {
          play: callback => reactNativeSound.play(callback),
          stop: () => reactNativeSound.stop(),
          resume: () => reactNativeSound.resume(),
          getCurrentTime: () => reactNativeSound.getCurrentTime(),
          pause: () => reactNativeSound.pause(),
          release: () => reactNativeSound.release(),
          errorCount: 0,
          key: reactNativeSound._key,
          duration: reactNativeSound.getDuration(),
        };

        return dispatch({ type: startPlayerTypes.success, sound, recording });
      });
    } else {
      dispatch({ type: startPlayerTypes.processing, buffering: true });
      const sound = {
        play: callback => (new Promise((resolve, reject) => {
          ReactNativeAudioStreaming.play(recording.audioUrl, { showIniOSMediaCenter: true, showInAndroidNotifications: true });
          DeviceEventEmitter.removeAllListeners();
          DeviceEventEmitter.addListener(
            'AudioBridgeEvent', (evt) => {
              if (evt.status === 'STOPPED') {
                callback();
              } else if (evt.status === 'PLAYING') {
                sound.duration = evt.duration;
                sound.currentTime = evt.progress;
                dispatch({ type: bufferCompleteType });
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
        key: 0,
      };

      return dispatch({ type: startPlayerTypes.success, sound, recording });
    }
  }
);

export const togglePlayer = play => (dispatch => dispatch({ type: togglePlayerTypes, play }));
