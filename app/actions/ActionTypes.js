import { createAsyncActionTypes } from './util.js';

export const RecordingActionTypes = {
  deleteRecordingTypes: createAsyncActionTypes('DELETE_RECORDINGS'),
  fetchRecordingsTypes: createAsyncActionTypes('FETCH_RECORDINGS'),
  saveRecordingsTypes: createAsyncActionTypes('SAVE_RECORDINGS'),
  updateRecordingTypes: createAsyncActionTypes('UPDATE_RECORDING'),
};

export const PlayerActionTypes = {
  startPlayerTypes: createAsyncActionTypes('START_PLAYER'),
  togglePlayerType: 'TOGGLE_PLAYER',
};
