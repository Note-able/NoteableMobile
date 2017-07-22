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
  delete: ({ url, auth }) => fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: auth,
    },
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

export const debounceFunc = (name, func, delay) => {
  const timeoutFunc = () => {
    func();
    clearTimeout(this[name]);
  };

  if (this[name] != null) {
    clearTimeout(this[name]);
    setTimeout(timeoutFunc, delay);
  } else {
    this[name] = setTimeout(timeoutFunc, delay);
  }
};
