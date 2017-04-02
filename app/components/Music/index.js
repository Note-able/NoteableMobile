import React, { Component, PropTypes } from 'react';
import Recording from './Recording.js';
import { StyleSheet, Text, View, ListView, Dimensions, TouchableHighlight } from 'react-native';
import Sound from 'react-native-sound';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import Realm from 'realm';

import { colors, gradients } from '../../styles';
import { dbName, recordingLocation } from '../../constants';
import { RecordingSchema } from '../../realmSchemas';

export default class MusicList extends Component { 
    static propTypes = {
        recordings: PropTypes.object.isRequired,
        initializePlayer: PropTypes.func.isRequired,
        syncRecording: PropTypes.func.isRequired
    }

    state = {
        multiSelect: false,
        selectedRecordings: {},
    }

    toggleSync = (recording) => {
        if (!recording.id) {
            this.props.syncRecording(recording);
        }
    }
    
    loadRecording = (name) => {
        const { initializePlayer, recordings } = this.props
        const audio = new Sound(`${name}.aac`, recordingLocation, (error) => {
            if (error) {
                console.warn(this.setState({ error: true }), error);
            } else {
                initializePlayer(recordings[name], audio);
            }
        });
    }

    selectRecording = (name) => {
        const selectedRecordings = { ...this.state.selectedRecordings } || {};
        selectedRecordings[name] = !selectedRecordings[name];
        this.setState({ selectedRecordings, multiSelect: true });
    }

    hideMultiSelect = () => {
        this.setState({ selectedRecordings: {}, multiSelect: false });
    }

    syncSelectedRecordings = () => {
        const selectedRecordings = { ...this.state.selectedRecordings }
        const recordings = { ...this.props.recordings };
        Object.keys(selectedRecordings).map((id) => {
            if(selectedRecordings[id]) {
                const recording = recordings[id];
                this.toggleSync(recording);
            }
        })
    }

    render () {        
        const { recordings } = this.props;
        if(Object.keys(recordings).length === 0) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>You aint got no Recordings Lieutenant Dan.</Text>
                </View>
            );
        }

        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.name !== r2.name || r1.isSynced != r2.isSynced})
            .cloneWithRows(recordings);

        const { multiSelect, selectedRecordings } = this.state;

        return (
            <View style={styles.container}>
                { multiSelect ? <SyncSongButtons onSave={this.syncSelectedRecordings} onCancel={this.hideMultiSelect} /> : null }
                <ListView
                    dataSource={dataSource}
                    renderRow={({name, date, duration, isSynced}) => (
                        <View>
                            <Recording
                                isSynced={isSynced}
                                select={this.selectRecording}
                                selected={!!selectedRecordings[name]}
                                showSelect={multiSelect}
                                name={name}
                                date={moment(date).format('D/M/YY')}
                                duration={duration}
                                loadRecording={(name) => {this.loadRecording(name);}}
                                toggleSync={() => { this.toggleSync(name, date); }} />
                        </View>)}
                />
            </View>
        );
    }
}

const SyncSongButtons = ({ onSave, onDelete, onCancel }) => (
    <View style={styles.buttons}>
        <TouchableHighlight onPress={onSave} style={styles.actionTextContainer}>
            <Text style={styles.sync}>Sync</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={onDelete} style={styles.actionTextContainer}>
            <Text style={styles.delete}>Delete</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={onCancel} style={[styles.actionTextContainer, { flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }]}>
            <Text style={styles.cancel}>Cancel</Text>
        </TouchableHighlight>
    </View>
);

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: windowWidth,
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: colors.dark,
        elevation: 5,
        backgroundColor: colors.white,
    },
    text : {     
        color: 'black',
    },
    sync: {
        color: colors.green,
        fontSize: 20,
    },
    delete: {
        color: colors.red,
        fontSize: 20,
    },
    cancel: {
        color: 'black',
        fontSize: 16,
    },
    actionTextContainer: {
        marginHorizontal: 10,
    }
});

