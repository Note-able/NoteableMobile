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
    const state = getState().PlayerReducer;
    dispatch({ type: startPlayerTypes.processing });

    // if we are playing the same recording
    if (state.recording != null && state.recording.id === recording.id) {
      state.sound.stop();
      dispatch({ type: startPlayerTypes.success, sound: state.sound, recording });
    }

    // remove existing resources
    if (state.sound != null && state.sound.stop != null) {
      state.sound.stop();
      state.sound.release();
    }

    // for local recordings
    if (recording.path !== '') {
      const reactNativeSound = new Sound(recording.path, '', (error) => {
        if (error) {
          return dispatch({ type: startPlayerTypes.error, error });
        }

        return dispatch({ type: startPlayerTypes.success, sound, recording });
      });
      const sound = {
        play: callback => (new Promise((resolve) => {
          dispatch({ type: bufferCompleteType });
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
      // for streamed recordings.
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
      };

      return dispatch({ type: startPlayerTypes.success, sound, recording });
    }
  }
);

export const togglePlayer = play => (dispatch => dispatch({ type: togglePlayerTypes, play }));
