import {
  PlayerActionTypes,
} from '../actions/ActionTypes';

import { logErrorToCrashlytics, logCustomToFabric } from '../util.js';

const {
  bufferCompleteType,
  startPlayerTypes,
} = PlayerActionTypes;

export default (state = { isPlaying: false, sound: null, recording: null, buffering: false }, action) => {
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
      return {
        ...state,
        sound: action.sound,
        recording: action.recording,
      };
    case bufferCompleteType:
      return {
        ...state,
        buffering: false,
      };
    case startPlayerTypes.error:
      logErrorToCrashlytics({ customMessage: 'starting player error: ', error });
      return state;
    case startPlayerTypes.processing:
      return {
        ...state,
        buffering: action.buffering,
      };
    default:
      return state;
  }
};
