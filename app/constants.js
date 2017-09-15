import RNFetchBlob from 'react-native-fetch-blob';

/** Preference Constants */
export const preferenceKeyValues = {
  celluarDataKey: 'USE_CELLULAR_DATA',
  autoDownloadKey: 'AUTO_DOWNLOAD_RECORDINGS',
};

export const preferenceKeys = [preferenceKeyValues.celluarDataKey, preferenceKeyValues.autoDownloadKey];
export const defaultValuePreference = (key) => {
  switch (key) {
    case preferenceKeyValues.celluarDataKey:
      return true;
    case preferenceKeyValues.autoDownloadKey:
      return false;
    default:
      return false;
  }
};

/** Data Constants */
export const dbName = 'noteable';
export const recordingLocation = `${RNFetchBlob.fs.dirs.DocumentDir}`;

/** Text Constants */

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

