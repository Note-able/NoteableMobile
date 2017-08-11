import { AsyncStorage } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import { AudioUtils } from 'react-native-audio';
import moment from 'moment';
import Schemas from '../realmSchemas';
import { fetchUtil, logErrorToCrashlytics } from '../util';
import { RecordingActionTypes } from './ActionTypes';
import { MapRecordingFromAPI, MapRecordingFromDB, MapRecordingsToAssocArray, MapRecordingToAPI } from '../mappers/recordingMapper';

const {
  deleteRecordingTypes,
  downloadRecordingTypes,
  fetchRecordingsTypes,
  logoutRecordingType,
  updateRecordingTypes,
  uploadRecordingTypes,
  saveRecordingsTypes,
  syncDownRecordingsTypes,
} = RecordingActionTypes;

const realm = Schemas.RecordingSchema;
const USER = '@ACCOUNTS:CURRENT_USER';
const INITIALIZE_PLAYER = 'INITIALIZE_PLAYER';
const TOGGLE_PLAY_FLAG = 'TOGGLE_PLAY_FLAG';

const validate = (recordings) => {
  const directory = AudioUtils.DocumentDirectoryPath;
  return recordings.map((record) => {
    if (record.isSynced || record.path.indexOf(directory) !== -1) {
      return record;
    }
    return record;
  });
};

const removeRecording = (recording, resolve) => {
  if (recording.path !== '') {
    RNFetchBlob.fs.unlink(recording.path);
  }
  realm.write(() => {
    const recordings = realm.objects('Recording').filtered(`id = ${recording.id}`);
    realm.delete(recordings);
    resolve(recording.id);
  });
};

const fetchRecordingsFromAPI = (dispatch, recordings, iteration, token, offset) => fetchUtil.get({ url: `https://beta.noteable.me/api/v1/recordings?offset=${offset}`, auth: token })
.then(response => response.json(), (error) => { throw error; })
  .then((result) => {
    iteration += 1;
    recordings = recordings.concat(result);

    if (result == null || result.length === 0 || iteration === 10) {
      return recordings;
    }

    return fetchRecordingsFromAPI(dispatch, recordings, iteration, token, offset + 20);
  }, (error) => { throw error; });

export const getRecordingTitle = () => {
  const untitled = realm.objects('Recording').filtered('name BEGINSWITH "Untitled "');
  return [...untitled].filter(x => x.name.split(' ').length === 2).map(x => parseInt(x.name.split(' ')[1], 10)).sort((a, b) => b - a)[0] + 1 || 1;
};

export const syncDownRecordings = () => (
  async (dispatch) => {
    const user = await AsyncStorage.getItem(USER);
    dispatch({ type: syncDownRecordingsTypes.processing });
    fetchRecordingsFromAPI(dispatch, [], 0, JSON.parse(user).jwt, 0)
      .then((recordings) => {
        realm.write(() => {
          recordings.forEach((x) => {
            const rec = MapRecordingFromAPI(x);
            let current;
            try {
              current = realm.objects('Recording').filtered(`resourceId = ${rec.resourceId}`)[0];
            } catch (e) {}

            const id = current == null ? Schemas.GetId(realm.objects('Recording')) + 1 : current.id;
            if (current != null && rec.dateModified >= current.dateModified) {
              realm.create('Recording', { audioUrl: rec.audioUrl, id }, true);
            } else if (current == null) {
              realm.create('Recording', { ...rec, path: '', id }, true);
            }
          });
          const result = [...validate(realm.objects('Recording').sorted('id', true))];
          dispatch({ type: syncDownRecordingsTypes.success, recordings: MapRecordingsToAssocArray(result, MapRecordingFromDB) });
        });
      })
      .catch(error => dispatch({ type: syncDownRecordingsTypes.error, error }));
  }
);

export const fetchRecordings = (filter, search) => (
  (dispatch) => {
    dispatch({ type: fetchRecordingsTypes.processing });

    new Promise((resolve, reject) => {
      try {
        const recordings = realm.objects('Recording');
        if (recordings == null) {
          return resolve([]);
        } else if (filter != null) {
          const result = [...validate(recordings.sorted(filter))];
          return resolve(result);
        } else if (search != null) {
          const result = [...validate(recordings.filtered(`name CONTAINS "${search}" OR tags CONTAINS "${search}"`))];
          return resolve(result);
        }
        const result = [...validate(recordings.sorted('id', true))];
        return resolve(result);
      } catch (e) {
        return reject(e);
      }
    }).then((result) => {
      const recordings = MapRecordingsToAssocArray(result, MapRecordingFromDB);
      dispatch({ type: fetchRecordingsTypes.success, recordings });
    })
    .catch(e => dispatch({ type: fetchRecordingsTypes.error, error: e }));
  }
);

// Maps recordings to associative array of proper display type.
export const addRecording = recording => (
  (dispatch) => {
    dispatch({ type: saveRecordingsTypes.processing });
    new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          realm.create('Recording', { ...recording, audioUrl: '', resourceId: 0 });
        });
        return resolve([...validate(realm.objects('Recording').sorted('id', true))]);
      } catch (e) {
        return reject(e);
      }
    }).then(recordings => dispatch({ type: saveRecordingsTypes.success, recordings: MapRecordingsToAssocArray(recordings, MapRecordingFromDB) }))
    .catch(error => dispatch({ type: saveRecordingsTypes.error, error }));
  }
);

export const deleteRecording = recording => (
  dispatch => new Promise(async (resolve) => {
    dispatch({ type: deleteRecordingTypes.processing });
    const user = await AsyncStorage.getItem(USER);

    if (user != null) {
      fetchRecordingsFromAPI(dispatch, [], 0, JSON.parse(user).jwt, 0);
      fetchUtil.delete({ url: `https://beta.noteable.me/api/v1/recordings/${recording.resourceId}`, auth: JSON.parse(user).jwt })
        .then((response) => {
          if (response.status === 204) {
            removeRecording(recording, resolve);
          } else {
            throw new Error('Failed delete');
          }
        });
    } else {
      removeRecording(recording, resolve);
    }
  }).then(id => dispatch({ type: deleteRecordingTypes.success, deletedId: id }))
    .catch(error => dispatch({ type: deleteRecordingTypes.error, error }))
);

export const updateRecording = recording => (
  (dispatch) => {
    dispatch({ type: updateRecordingTypes.processing });
    new Promise((resolve, reject) => {
      try {
        let record;
        realm.write(() => {
          record = realm.objects('Recording').filtered(`id = ${recording.id}`)[0];
          record.name = recording.name;
          record.tags = recording.tags;
        });
        return resolve({ ...record });
      } catch (e) {
        return reject(e);
      }
    }).then(record => dispatch({ type: updateRecordingTypes.success, record: MapRecordingFromDB(record) }))
    .catch(error => dispatch({ type: updateRecordingTypes.error, error }));
  }
);

export const uploadRecording = (rec, user) => (
  (dispatch) => {
    if (rec == null || user == null) {
      dispatch({ type: uploadRecordingTypes.error });
    } else {
      const recording = MapRecordingToAPI(rec);

      dispatch({ type: uploadRecordingTypes.processing });

      new Promise((resolve, reject) => {
        try {
          /* eslint-disable no-undef */
          const form = new FormData();
          /* eslint-enable */

          form.append('duration', recording.duration);
          form.append('name', recording.name);
          form.append('size', recording.size);
          form.append('extension', '.aac');
          let data = '';
          RNFetchBlob.fs.readStream(
          recording.path,
          // encoding, should be one of `base64`, `utf8`, `ascii`
          'base64',
          // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
          // when reading file in BASE64 encoding, buffer size must be multiples of 3.
          4095)
          .then((ifstream) => {
            ifstream.open();
            ifstream.onData((chunk) => {
              // when encoding is `ascii`, chunk will be an array contains numbers
              // otherwise it will be a string
              data += chunk;
            });

            ifstream.onError((err) => {
              logErrorToCrashlytics(err);
            });

            ifstream.onEnd(() => {
              form.append('file', data);
              fetch('https://beta.noteable.me/api/v1/recordings', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'multipart/form-data',
                  Authorization: user.jwt,
                },
                body: form,
              })
              .then(res => res.json())
              .then((song) => {
                realm.write(() => {
                  realm.create('Recording', { id: parseInt(rec.id, 10), isSynced: true, resourceId: parseInt(song.id, 10) }, true);
                  resolve({ ...recording, isSynced: true, resourceId: song.id, id: rec.id });
                });
              });
            });
          });
        } catch (e) {
          reject(e);
        }
      }).then(update => dispatch({ type: uploadRecordingTypes.success, recording: update, deletedId: rec.id }))
      .catch(error => dispatch({ type: uploadRecordingTypes.error, error }));
    }
  }
);

export const downloadRecording = recording => (
  (dispatch) => {
    dispatch({ type: downloadRecordingTypes.processing });
    const fileName = `${AudioUtils.DocumentDirectoryPath}/${moment().format('HHmmss')}.aac`;

    RNFetchBlob
      .config({
        path: fileName,
      })
      .fetch('GET', recording.audioUrl)
      .then((response) => {
        realm.write(() => {
          realm.create('Recording', { id: recording.id, path: response.data }, true);
          dispatch({ type: downloadRecordingTypes.success, record: { ...recording, path: fileName } });
        });
      })
      .catch(error => dispatch({ type: downloadRecordingTypes.error, error }));
  }
);

export const logout = () => (
  (dispatch) => {
    const recordings = [...realm.objects('Recording')];

    recordings.forEach((record) => {
      if (record.audioUrl != null && record.audioUrl !== '') {
        removeRecording({ ...record }, () => {});
      }
    });

    dispatch({ type: logoutRecordingType, recordings: MapRecordingsToAssocArray([...realm.objects('Recording')], MapRecordingFromDB) });
  }
);

export const initializePlayer = (currentRecording, audio) => (
    { type: INITIALIZE_PLAYER, currentRecording, audio }
);

export const togglePlayFlag = () => (
    { type: TOGGLE_PLAY_FLAG }
);
