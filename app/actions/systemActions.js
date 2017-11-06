import BackgroundFetch from 'react-native-background-fetch';
import { logCustomToFabric, logErrorToCrashlytics } from '../util';
import { SystemActionTypes } from './ActionTypes.js';

const {
  alertType,
  networkChangeType,
} = SystemActionTypes;

export const networkConnectivityChange = status => (
  (dispatch, getState) => {
    const { SystemReducer } = getState();
    if (SystemReducer.network.connected == null || SystemReducer.network.connected !== status) {
      dispatch({ type: networkChangeType, status });
    }
  }
);

export const runBackgroundRequests = () => (
  (dispatch, getState) => {
    BackgroundFetch.configure({
      stopOnTerminate: false,
    }, () => {
      const { SystemReducer } = getState();
      if (SystemReducer.network.connected !== 'none' && SystemReducer.network.queue != null && SystemReducer.network.queue.length !== 0) {
        logCustomToFabric('Offline Update Requested');
      }

      BackgroundFetch.finish();
    }, (error) => {
      logErrorToCrashlytics(error);
    });
  }
);

export const alert = (message, type) => (
  (dispatch) => {
    dispatch({ type: alertType, message, kind: type });
  }
);
