import {
  PlayerActionTypes,
} from '../actions/ActionTypes';

import { logErrorToCrashlytics, logCustomToFabric } from '../util.js';

const {
  bufferCompleteType,
  startPlayerTypes,
  finishedPlayingType,
} = PlayerActionTypes;

export default (state = { isPlaying: false, sound: null, recording: null, buffering: false, playerState: false }, action) => {
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
        isPlaying: true,
        sound: action.sound,
        recording: action.recording,
        playerState: !state.playerState,
        buffering: false,
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
        buffering: true,
      };
    case finishedPlayingType:
      return {
        ...state,
        isPlaying: false,
      };
    default:
      return state;
  }
};
