import { AsyncStorage, Platform } from 'react-native';
import { Answers, Crashlytics } from 'react-native-fabric';
import { preferenceKeys, defaultValuePreference } from './constants';

/* eslint-disable no-undef */
export const fetchUtil = {
  get: ({ url, auth }, getState) => {
    const fetchParams = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: auth,
      },
    };

    if (getState == null) {
      return fetch(url, fetchParams);
    }

    return asyncFetchWithPreferences(url, fetchParams, getState);
  },
  postWithBody: ({ url, auth, body, headers }, getState) => {
    const fetchParams = {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    };

    if (getState == null) {
      return fetch(url, fetchParams);
    }

    return asyncFetchWithPreferences(url, fetchParams, getState);
  },
  delete: ({ url, auth }, getState) => {
    const fetchParams = {
      method: 'DELETE',
      headers: {
        Authorization: auth,
      },
    };

    if (getState == null) {
      return fetch(url, fetchParams);
    }

    return asyncFetchWithPreferences(url, fetchParams, getState);
  },
};

export const logErrorToCrashlytics = (error) => {
  let loggableError = error;
  if (typeof error === 'object') {
    loggableError = JSON.stringify(error);
  }

  if (Platform.OS === 'ios') {
    Crashlytics.recordError(loggableError);
  } else {
    Crashlytics.logException(loggableError);
  }
};

export const logCustomToFabric = (eventType, properties) => {
  Answers.logCustom(eventType, properties);
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

/** Preferences Utility */
export const getPreferences = async () => {
  try {
    const preferences = await AsyncStorage.multiGet(preferenceKeys);
    return mapPreferences(preferences);
  } catch (e) {
    return {};
  }
};

const asyncFetchWithPreferences = async (url, fetchParams, getState) => {
  const preferences = await getPreferences();
  const { System } = getState();
  if (System.network.connected === 'cellular' && preferences[preferenceKeys.celluarDataKey] !== 'true') {
    throw new Error('cellular');
  } else if (System.network.connected === '' || System.network.connected === 'none') {
    throw new Error('network');
  } else {
    return fetch(url, fetchParams);
  }
};

const mapPreferences = preferences => preferenceKeys.reduce((accumulator, preferenceKey) => {
  const current = preferences.find(x => x[0] === preferenceKey);

  if (current == null) {
    return {
      ...accumulator,
      [preferenceKey]: defaultValuePreference(preferenceKey),
    };
  }
  return {
    ...accumulator,
    [preferenceKey]: current[1],
  };
}, {});
