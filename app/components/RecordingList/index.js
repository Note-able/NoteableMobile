import React, { Component } from 'react';
import Recording from './Recording.js';
import {
  StyleSheet,
  Text,
  View,
  ListView,
} from 'react-native';

import { dbName, recordingsDirectory } from '../../constants';
import Realm from 'realm';
import { RecordingSchema } from '../../realmSchemas';
import RNFS from 'react-native-fs';

export default class RecordingList extends Component { 
        constructor(props) {
        super(props);
        
        const recordingLocation = `${RNFS.DocumentDirectoryPath}/${recordingsDirectory}`;
        /*const dirItems = RNFS.readDir(recordingLocation).then((result) => {
            const recordingsByName = result.reduce((map, file) => {
                map[file.name] = file;
                return map;
            }, {});
            this.setState({recordings: recordingsByName});
        });*/
        this.state = {recordings: {}};
    }
    
    componentDidMount() {
        this.getRecordings();
    }
    
    getRecordings = () => {
        // Get the default Realm with support for our objects
        const realm = new Realm({schema: [RecordingSchema]});
        const recordings = realm.objects('Recording');
        this.mapRealmResults(recordings);              
    }
    
    mapRealmResults = (results) => {
        const recordingsByName = results.reduce((map, file) => {
            map[file.name] = file;
            return map;
        }, {});
        this.setState({recordings: recordingsByName});
    }
    
    toggleSync = (name, date) => {
        const realm = new Realm({schema: [RecordingSchema]});
        const recordings = realm.objects('Recording');
        const recording = recordings.filtered(`name = "${name}" AND date = "${date}" `)[0];
        realm.write(() => {
            recording.isSynced = !recording.isSynced;
        });
        this.getRecordings();
    }
    
    render () {
        if(Object.keys(this.state.recordings).length === 0) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>You aint got no Recordings Lieutenant Dan.</Text>
                </View>
            );
        }
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.name !== r2.name || r1.isSynced != r2.isSynced})
            .cloneWithRows(this.state.recordings);

        return (
            <View style={styles.container}>
                <ListView
                    dataSource={dataSource}
                    renderRow={(recording) => <View><Recording recording={recording} toggleSync={() => { this.toggleSync(recording.name, recording.date); }} /></View>}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
        backgroundColor: 'black',
    },
    text : {     
        color: '#F5FCFF',
    }
});