import {
  PlayerActionTypes,
} from '../actions/ActionTypes';

import { logErrorToCrashlytics, logCustomToFabric } from '../util.js';

const {
  startPlayerTypes,
} = PlayerActionTypes;

export default (state = { isPlaying: false, sound: null, recording: null }, action) => {
  const { type, error } = action;
  switch (type) {
    case startPlayerTypes.success:
      logCustomToFabric('Play Recording', state.sound);
      break;
    default:
      break;
  }

  switch (type) {
    case startPlayerTypes.success:
      if (state.sound != null) {
        state.sound.stop();
        state.sound.release();
      }

      return {
        ...state,
        sound: action.sound,
        recording: action.recording,
      };
    case startPlayerTypes.error:
      logErrorToCrashlytics({ customMessage: 'starting player error: ', error });
      return state;
    default:
      return state;
  }
};
