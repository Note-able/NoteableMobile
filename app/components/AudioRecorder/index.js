import React, {Component} from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Modal,
    TextInput
} from 'react-native';

import Audio from './Audio.js';
import Realm from 'realm';
import { RecordingSchema } from '../../realmSchemas';

export default class AudioRecorder extends Component {
    addRecording = (name, date, duration) => {
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
            });
        });
    }

    render () {
        return (
            <View>
                <Audio addRecording={this.addRecording} />
            </View>
        );
    }
}