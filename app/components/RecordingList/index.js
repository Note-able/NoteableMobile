import React, { Component } from 'react';
import Recording from './Recording.js';
import { StyleSheet, Text, View, ListView } from 'react-native';

import { dbName, recordingsDirectory } from '../../constants';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchRecordings, initializePlayer } from '../../actions/recordingActions';

const mapStateToProps = (state) => ({
    recordings: mapRealmResults(state.recordingsReducer.recordings),
    currentRecording: state.recordingsReducer.currentRecording,
});

const mapDispatchToProps = (dispatch) => ({
    getRecordings: () => dispatch(fetchRecordings()),
    initializePlayer: (currentRecording, audio) => dispatch(initializePlayer(currentRecording, audio)),
});

class RecordingList extends Component { 
        constructor(props) {
        super(props);
        
        const recordingLocation = `${RNFS.DocumentDirectoryPath}/${recordingsDirectory}`;        

    }
    
    componentDidMount() {
        this.props.getRecordings();   
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
    
    loadRecording = (name) => {
        const { initializePlayer, recordings } = this.props
        const audio = new Sound(`${name}.aac`, `${RNFS.DocumentDirectoryPath}/recordings`, (error) => {
            if (error) {
                console.warn(this.setState({ error: true }), error);
            } else {
                initializePlayer(recordings[name], audio);
            }
        });
    }
    
    render () {
        const {onLayout, recordings} = this.props;
        if(Object.keys(recordings).length === 0) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>You aint got no Recordings Lieutenant Dan.</Text>
                </View>
            );
        }
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.name !== r2.name || r1.isSynced != r2.isSynced})
            .cloneWithRows(recordings);

        return (
            <View style={styles.container} onLayout={(event) => onLayout(event, 'music')}>
                <ListView
                    dataSource={dataSource}
                    renderRow={({name, date, duration}) => (
                        <View>
                            <Recording
                                name={name}
                                date={date}
                                duration={duration}
                                loadRecording={(name) => {this.loadRecording(name);}}
                                toggleSync={() => { this.toggleSync(name, date); }} />
                        </View>)}
                />
            </View>
        );
    }
}

const mapRealmResults = (results) => {
    return results.reduce((map, file) => {
        map[file.name] = file;
        return map;
    }, {});
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordingList);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    text : {     
        color: 'black',
    }
});