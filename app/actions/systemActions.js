import { SystemActionTypes } from './ActionTypes.js';

const { alertType, networkChangeType } = SystemActionTypes;

export const networkConnectivityChange = status => (dispatch, getState) => {
  const { SystemReducer } = getState();
  if (SystemReducer.network.connected == null || SystemReducer.network.connected !== status) {
    dispatch({ type: networkChangeType, status });
  }
};

export const alert = (message, type) => dispatch => {
  dispatch({ type: alertType, message, kind: type });
};
