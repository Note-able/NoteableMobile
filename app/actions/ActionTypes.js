import { createAsyncActionTypes } from './util.js';

export const RecordingActionTypes = {
  fetchRecordingsTypes: createAsyncActionTypes('FETCH_RECORDINGS'),
};

export const PlayerActionTypes = {
  startPlayerTypes: createAsyncActionTypes('START_PLAYER'),
  togglePlayerType: 'TOGGLE_PLAYER',
};
