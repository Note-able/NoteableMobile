export const createAsyncActionTypes = type => ({
  processing: `PROCESSING.${type}`,
  error: `ERROR.${type}`,
  success: `SUCCESS.${type}`,
  queue: `QUEUE.${type}`,
});


export const RecordingActionTypes = {
  deleteRecordingTypes: createAsyncActionTypes('DELETE_RECORDINGS'),
  downloadRecordingTypes: createAsyncActionTypes('DOWNLOAD_RECORDINGS'),
  fetchRecordingsTypes: createAsyncActionTypes('FETCH_RECORDINGS'),
  logoutRecordingType: 'LOGOUT_RECORDINGS',
  saveRecordingsTypes: createAsyncActionTypes('SAVE_RECORDINGS'),
  syncDownRecordingsTypes: createAsyncActionTypes('SYNC_DOWN'),
  updateRecordingTypes: createAsyncActionTypes('UPDATE_RECORDING'),
  uploadRecordingTypes: createAsyncActionTypes('UPLOAD_RECORDING'),
};

export const PlayerActionTypes = {
  startPlayerTypes: createAsyncActionTypes('START_PLAYER'),
  togglePlayerType: 'TOGGLE_PLAYER',
};

export const AccountActionTypes = {
  getCurrentUserTypes: createAsyncActionTypes('GET_CURRENT_USER'),
  getUserPreferencesTypes: createAsyncActionTypes('GET_USER_PREFERENCES'),
  fetchSignInTypes: createAsyncActionTypes('FETCH_SIGNIN'),
  loginFacebookTypes: createAsyncActionTypes('LOGIN_FACEBOOK'),
  logoutTypes: createAsyncActionTypes('LOGOUT_USER'),
  registerUserTypes: createAsyncActionTypes('REGISTER_USER'),
  setUserPreferencesTypes: createAsyncActionTypes('SET_USER_PREFERENCES'),
};

export const SystemMessageActionTypes = {
  networkingFailureType: 'NETWORK_FAILURE',
};

export const SystemActionTypes = {
  networkChangeType: 'NETWORK_CHANGE',
  networkPreferencesFailureType: {
    cellular: 'NETWORK_PREFERENCES_CELLULAR',
    wifi: 'NETWORK_PREFERENCES_CELLULAR',
    network: SystemMessageActionTypes.networkingFailureType,
  },
  queueNetworkRequestType: 'QUEUE_NETWORK_REQUEST',
};
