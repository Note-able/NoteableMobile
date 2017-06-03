import { Platform } from 'react-native';
import { Crashlytics } from 'react-native-fabric';

/* eslint-disable no-undef */
export const fetchUtil = {
  get: ({ url, auth }) => fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: auth,
    },
  }),
  postWithBody: ({ url, auth, body }) => fetch(url, {
    method: 'POST',
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }),
};
/* eslint-enable */

export const logErrorToCrashlytics = (error) => {
  if (Platform.OS === 'ios') {
    Crashlytics.recordError(error);
  } else {
    Crashlytics.logException(error);
  }
};
