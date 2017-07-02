import { createAsyncActionTypes } from './util.js';

export const RecordingActionTypes = {
  deleteRecordingTypes: createAsyncActionTypes('DELETE_RECORDINGS'),
  fetchRecordingsTypes: createAsyncActionTypes('FETCH_RECORDINGS'),
  saveRecordingsTypes: createAsyncActionTypes('SAVE_RECORDINGS'),
  syncDownRecordingsTypes: createAsyncActionTypes('SYNC_DOWN'),
  updateRecordingTypes: createAsyncActionTypes('UPDATE_RECORDING'),
};

export const PlayerActionTypes = {
  startPlayerTypes: createAsyncActionTypes('START_PLAYER'),
  togglePlayerType: 'TOGGLE_PLAYER',
};

export const AccountActionTypes = {
  getCurrentUserTypes: createAsyncActionTypes('GET_CURRENT_USER'),
  fetchSignInTypes: createAsyncActionTypes('FETCH_SIGNIN'),
  loginFacebookTypes: createAsyncActionTypes('LOGIN_FACEBOOK'),
  logoutTypes: createAsyncActionTypes('LOGOUT_USER'),
  registerUserTypes: createAsyncActionTypes('REGISTER_USER'),
};

export const SystemMessageActionTypes = {
  networkingFailureType: 'NETWORK_FAILURE',
};
