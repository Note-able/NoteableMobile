import { createAsyncActionTypes } from './util.js';

export const RecordingActionTypes = {
  fetchRecordingsType: createAsyncActionTypes('FETCH_RECORDINGS'),
};

export const PlayerActionTypes = {
  startPlayerTypes: createAsyncActionTypes('START_PLAYER'),
  togglePlayerType: 'TOGGLE_PLAYER',
};
