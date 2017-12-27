import Sound from 'react-native-sound';
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

    const splits = recording.path.split('/');
    const realPath = `${AudioUtils.DocumentDirectoryPath}/${splits[splits.length - 1]}`;

    const reactNativeSound = new Sound(recording.path !== '' ? realPath : recording.audioUrl, '', (error) => {
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
  }
);

export const togglePlayer = play => (dispatch => dispatch({ type: togglePlayerTypes, play }));
