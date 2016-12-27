import Realm from 'realm';

import { RecordingSchema } from '../realmSchemas';

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

export const initializePlayer = (currentRecording, audio) => {
    return {type: 'INITIALIZE_PLAYER', currentRecording, audio };
}
