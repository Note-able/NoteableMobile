import RNFetchBlob from 'react-native-fetch-blob';
import { AudioUtils } from 'react-native-audio';

import Schemas from '../realmSchemas';
import { fetchUtil, logErrorToCrashlytics } from '../util';
import { RecordingActionTypes } from './ActionTypes';
import { DisplayTime, MapRecordingFromAPI } from '../mappers/recordingMapper';

const {
  deleteRecordingTypes,
  fetchRecordingsTypes,
  updateRecordingTypes,
  uploadRecordingTypes,
  saveRecordingsTypes,
  syncDownRecordingsTypes,
} = RecordingActionTypes;

const realm = Schemas.RecordingSchema;
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

const fetchRecordingsFromAPI = (dispatch, recordings, iteration) => fetchUtil.get('http://beta.noteable.me/api/v1/recordings', {
  method: 'GET',
}).then(response => response.json(), (error) => { throw error; })
  // eslint-disable-next-line no-loop-func
  .then((result) => {
    iteration += 1;
    recordings.concat(result);

    if (result.length === 0 && iteration === 10) {
      return new Promise().resolve(recordings);
    }

    return fetchRecordingsFromAPI(dispatch, recordings, iteration);
  }, (error) => { throw error; });

export const syncDownRecordings = () => (
  (dispatch) => {
    dispatch({ type: syncDownRecordingsTypes.processing });
    fetchRecordingsFromAPI(dispatch, [], 0)
      .then((recordings) => {
        realm.write(() => {
          const result = recordings.map((x) => {
            const rec = MapRecordingFromAPI(x);
            realm.create(rec);
            return {
              ...rec,
              durationDisplay: DisplayTime(rec.duration * 1000),
            };
          });
          dispatch({ type: syncDownRecordingsTypes.success, recordings: result });
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
        if (filter != null) {
          return resolve([...validate(realm.objects('Recording').sorted(filter))]);
        } else if (search != null) {
          return resolve([...validate(realm.objects('Recording').sorted('id', true).filtered(`name CONTAINS "${search}"`))]);
        }
        return resolve([...validate(realm.objects('Recording').sorted('id', true))]);
      } catch (e) {
        return reject(e);
      }
    }).then(recordings => dispatch({ type: fetchRecordingsTypes.success, recordings }))
    .catch(e => dispatch({ type: fetchRecordingsTypes.error, error: e }));
  }
);

export const addRecording = recording => (
  (dispatch) => {
    dispatch({ type: saveRecordingsTypes.processing });
    new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          const record = realm.objects('Recording').filtered(`name = "${recording.name}"`);

          if (record.length !== 0) {
            realm.create('Recording', { ...recording, name: `${recording.name} (1)` });
          } else {
            realm.create('Recording', recording);
          }
        });
        return resolve([...realm.objects('Recording').sorted('id', true)]);
      } catch (e) {
        return reject(e);
      }
    }).then(recordings => dispatch({ type: saveRecordingsTypes.success, recordings }))
    .catch(error => dispatch({ type: saveRecordingsTypes.error, error }));
  }
);

export const deleteRecording = recording => (
  dispatch => new Promise((resolve) => {
    if (!recording.isSynced) {
      RNFetchBlob.fs.unlink(recording.path);
      realm.write(() => {
        const recordings = realm.objects('Recording').filtered(`id = ${recording.id}`);
        realm.delete(recordings);
        resolve(recording.id);
      });
    }
  }).then(id => dispatch({ type: deleteRecordingTypes.success, id }))
    .catch((error) => {
      logErrorToCrashlytics(error);
      dispatch({ type: deleteRecordingTypes.error, error });
    })
);

export const updateRecording = recording => (
  (dispatch) => {
    dispatch({ type: updateRecordingTypes.processing });
    new Promise((resolve, reject) => {
      try {
        let record;
        realm.write(() => {
          const rec = realm.objects('Recording');
          let index = 0;
          record = realm.objects('Recording').filtered(`id = ${recording.id}`)[0];

          while (rec.filtered(`name = "${recording.name}${index === 0 ? '' : ` (${index})`}"`).length !== 0) {
            index += 1;
          }

          if (index !== 0) {
            record.name = `${recording.name} (${index})`;
          } else {
            record.name = recording.name;
          }
        });
        return resolve({ ...record });
      } catch (e) {
        return reject(e);
      }
    }).then(record => dispatch({ type: updateRecordingTypes.success, record }))
    .catch(error => dispatch({ type: updateRecordingTypes.error, error }));
  }
);

export const uploadRecording = (recording, user) => (
  (dispatch) => {
    console.log('Recording: ', recording);
    console.log('User: ', user);
    if (recording == null || user == null) {
      return dispatch({ type: uploadRecordingTypes.error });
    }

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
            fetch('http://beta.noteable.me/api/v1/recordings', {
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
              console.log(song);
              realm.write(() => {
                realm.create('Recording', { id: recording.id, isSynced: true, resourceId: song.id }, true);
                resolve({ ...recording, isSynced: true });
              });
            });
          });
        });
      } catch (e) {
        console.log('error ', e);
        reject(e);
      }
    }).then(update => dispatch({ type: uploadRecordingTypes.success, recording: update }))
    .catch(error => dispatch({ type: uploadRecordingTypes.error, error }));
  }
);

export const initializePlayer = (currentRecording, audio) => (
    { type: INITIALIZE_PLAYER, currentRecording, audio }
);

export const togglePlayFlag = () => (
    { type: TOGGLE_PLAY_FLAG }
);
