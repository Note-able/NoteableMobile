import Realm from 'realm';
import RNFetchBlob from 'react-native-fetch-blob';

import { RecordingSchema } from '../realmSchemas';
import { recordingLocation } from '../constants';
import { fetchUtil, logErrorToCrashlytics } from '../util';

const RECORDINGS_FETCHED = 'RECORDINGS_FETCHED';
const GET_RECORDINGS_FROM_REALM = 'GET_RECORDINGS_FROM_REALM';
const INITIALIZE_PLAYER = 'INITIALIZE_PLAYER';
const TOGGLE_PLAY_FLAG = 'TOGGLE_PLAY_FLAG';
const RECORDING_SYNCED = 'RECORDING_SYNCED';

const getRecordingsFromRealm = (realm) => realm.objects('Recording');

export const fetchRecordings = () => {
    return (dispatch) => {
        const realm = new Realm({schema: [RecordingSchema]});
        const recordings = getRecordingsFromRealm(realm);
        return dispatch({type: GET_RECORDINGS_FROM_REALM, recordings});
    };
}

export const addRecording = (name, date, duration) => {
    return (dispatch) => {
        const realm = new Realm({schema: [RecordingSchema]});
        // Create Realm objects and write to local storage
        realm.write(() => {
            let recording = realm.create('Recording', {
                name,
                date,
                duration,
                path: `${name}.aac`,
                description: 'some description',
                isSynced: false,
                id: '',
            });
        });

        const recordings = getRecordingsFromRealm(realm);        
        dispatch({ type: GET_RECORDINGS_FROM_REALM, recordings });
    };
}

export const uploadSong = (recording, user) => {
    return (dispatch) => {
            let form = new FormData();
            form.append('duration', recording.duration);
            form.append('name', recording.name);
            form.append('size', '1000kb');
            form.append('extension', '.aac');
            let data = '';
            RNFetchBlob.fs.readStream(
            // file path
            `${recordingLocation}/${recording.name}.aac`,
            // encoding, should be one of `base64`, `utf8`, `ascii`
            'base64',
            // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
            // when reading file in BASE64 encoding, buffer size must be multiples of 3.
            4095)
            .then((ifstream) => {
                ifstream.open()
                ifstream.onData((chunk) => {
                    // when encoding is `ascii`, chunk will be an array contains numbers
                    // otherwise it will be a string
                    data += chunk
                })
                ifstream.onError((err) => {
                console.log('oops', err)
                })
                ifstream.onEnd(() => {  
                    form.append('file', data)
                    fetch('http://beta.noteable.me/post-blob', {
                        method : 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'multipart/form-data',
                            'Authorization': user.jwt,
                        },
                        body : form
                    })
                    .then((res) => res.json())
                    .then((song) => {
                        const realm = new Realm({schema: [RecordingSchema]});
                        realm.write(() => {
                            recording.isSynced = true;
                            recording.id = song.id;
                        });
                        const recordings = getRecordingsFromRealm(realm);
                        dispatch({ type: RECORDING_SYNCED, recordings });
                    });
                })
            })
    }
} 

const fetchRecordingsFromApi = (user) => (
  (dispatch) => {
    fetchUtil.get({ url: 'http://beta.noteable.me/recordings/', auth: user.jwt })
    .then(response => response.json())
    .then((recordings) => {
      dispatch({ type: RECORDINGS_FETCHED, recordings });
    })
    .catch(error => logErrorToCrashlytics(error));
  }
);

export const initializePlayer = (currentRecording, audio) => (
    { type: INITIALIZE_PLAYER, currentRecording, audio }
);

export const togglePlayFlag = () => (
    { type: TOGGLE_PLAY_FLAG }
);
