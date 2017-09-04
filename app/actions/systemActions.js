import BackgroundFetch from 'react-native-background-fetch';
import { logCustomToFabric, logErrorToCrashlytics } from '../util';
import { SystemActionTypes } from './ActionTypes.js';

const {
  networkChangeType,
} = SystemActionTypes;

export const networkConnectivityChange = status => (
  (dispatch, getState) => {
    const { System } = getState();
    if (System.network.connected == null || System.network.connected !== status) {
      dispatch({ type: networkChangeType, status });
    }
  }
);

export const runBackgroundRequests = () => (
  (dispatch, getState) => {
    BackgroundFetch.configure({
      stopOnTerminate: false,
    }, () => {
      const { System } = getState();
      if (System.network.connected !== 'none' && System.network.queue != null && System.network.queue.length !== 0) {
        logCustomToFabric('Offline Update Requested');
      }

      BackgroundFetch.finish();
    }, (error) => {
      logErrorToCrashlytics(error);
      console.log('[js] RNBackgroundFetch failed to start');
    });
  }
);
