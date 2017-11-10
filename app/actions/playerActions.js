import Sound from 'react-native-sound';
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import {
  DeviceEventEmitter,
} from 'react-native';
import { AudioUtils } from 'react-native-audio';
import { PlayerActionTypes } from './ActionTypes.js';

const {
  bufferCompleteType,
  startPlayerTypes,
  togglePlayerTypes,
  finishedPlayingType,
} = PlayerActionTypes;

export const startPlayer = recording => (
  async (dispatch, getState) => {
    const state = getState().PlayerReducer;
    if (state.buffering) {
      return;
    }

    dispatch({ type: startPlayerTypes.processing });
    if (state.sound != null && state.sound.stop != null) {
      state.sound.stop();
      state.sound.release();
    }

    if (recording.path !== '') {
      const splits = recording.path.split('/');
      const realPath = `${AudioUtils.DocumentDirectoryPath}/${splits[splits.length - 1]}`;

      const reactNativeSound = new Sound(realPath, '', (error) => {
        if (error) {
          dispatch({ type: bufferCompleteType });
          return dispatch({ type: startPlayerTypes.error, error });
        }

        const sound = {
          play: () => reactNativeSound.play(() => {
            dispatch({ type: finishedPlayingType });
          }),
          stop: () => reactNativeSound.stop(),
          resume: () => reactNativeSound.resume(),
          getCurrentTime: () => reactNativeSound.getCurrentTime(),
          pause: () => reactNativeSound.pause(),
          release: () => reactNativeSound.release(),
          errorCount: 0,
          key: reactNativeSound._key,
          duration: reactNativeSound.getDuration(),
        };

        sound.play();

        dispatch({ type: bufferCompleteType });
        return dispatch({ type: startPlayerTypes.success, sound, recording });
      });
    } else {
      dispatch({ type: startPlayerTypes.processing, buffering: true });
      const sound = {
        play: () => (new Promise((resolve, reject) => {
          ReactNativeAudioStreaming.play(recording.audioUrl, { showIniOSMediaCenter: true, showInAndroidNotifications: true });
          DeviceEventEmitter.removeAllListeners();
          DeviceEventEmitter.addListener(
            'AudioBridgeEvent', (evt) => {
              if (evt.status === 'STOPPED') {
                dispatch({ type: bufferCompleteType });
                dispatch({ type: finishedPlayingType });
              } else if (evt.status === 'PLAYING') {
                sound.duration = evt.duration;
                sound.currentTime = evt.progress;
                if (!sound.hasStarted) {
                  sound.hasStarted = true;
                  dispatch({ type: startPlayerTypes.success, sound, recording });
                  dispatch({ type: bufferCompleteType });
                }
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
        duration: recording.duration,
        hasStarted: false,
      };

      sound.play();
    }
  }
);

export const togglePlayer = play => (dispatch => dispatch({ type: togglePlayerTypes, play }));
