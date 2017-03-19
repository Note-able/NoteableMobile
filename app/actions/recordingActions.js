import Realm from 'realm';
import RNFetchBlob from 'react-native-fetch-blob';

import { RecordingSchema } from '../realmSchemas';
import { recordingLocation } from '../constants'

const getRecordingsFromRealm = (realm) => realm.objects('Recording');

export const fetchRecordings = () => {
    return (dispatch) => {
        const realm = new Realm({schema: [RecordingSchema]});
        const recordings = getRecordingsFromRealm(realm);
        return dispatch({type: 'GET_RECORDINGS', recordings});
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
        dispatch({type: 'GET_RECORDINGS', recordings});
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
                    .then((res) => {
                        console.log(res.text())
                        dispatch({ type: 'nothing' });
                    });
                })
            })
    }
} 

export const initializePlayer = (currentRecording, audio) => {
    return {type: 'INITIALIZE_PLAYER', currentRecording, audio };
}

export const togglePlayFlag = () => {
    return {type: 'TOGGLE_PLAY_FLAG' };
}
