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
import moment from 'moment';

import {AudioRecorder, AudioUtils} from 'react-native-audio';
import RNFS from 'react-native-fs';
import { dbName, recordingsDirectory } from '../../constants';

export default class Audio extends Component {
    constructor(props) {
        super(props);
        
        state = {
            currentTime: 0.0,
            recording: false,
            stoppedRecording: false,
            stoppedPlaying: false,
            playing: false,
            finished: false,
            fileModalVisible: false
        };
        const recordingLocation = `${RNFS.DocumentDirectoryPath}/recordings`;
        RNFS.mkdir(recordingLocation);
        this.state = state;
        this._recordingLocation = recordingLocation;
    }

    prepareRecordingPath(audioPath){
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }

    componentDidMount() {
        AudioRecorder.onProgress = (data) => {
            console.error(data.currentTime);
            this.setState({currentTime: Math.floor(data.currentTime)});
        };
        AudioRecorder.onFinished = (data) => {
            this.setState({finished: data.finished});
            console.log(`Finished recording: ${data.finished}`);
        };
    }

    pause = () => {
        if (this.state.recording){
            AudioRecorder.pauseRecording();
            this.setState({stoppedRecording: true, recording: false});
        }
        else if (this.state.playing) {
            AudioRecorder.pausePlaying();
            this.setState({playing: false, stoppedPlaying: true});
        }
    }

    stop = () => {
        if (this.state.recording) {
            AudioRecorder.stopRecording();
            const duration = moment(moment().diff(moment(this.state.datedFilePath, 'YYYY-MM-DD HH:mm:ss'))).format('mm:ss');
            this.setState({stoppedRecording: true, recording: false, fileModalVisible: true, fileName: this.state.datedFilePath, duration});
        } else if (this.state.playing) {
            AudioRecorder.stopPlaying();
            this.setState({playing: false, stoppedPlaying: true});
        }
    }

    play = () => {
        if (this.state.recording) {
            this.stop();
            this.setState({recording: false});
        }
        AudioRecorder.playRecording();
        this.setState({playing: true});
    }
    
    startOrStopRecording = () => {
        if(!this.state.recording){
            const datedFilePath = `${moment().format('YYYY-MM-DD HH:mm:ss')}`;
            const audioPath = `${this._recordingLocation}/${datedFilePath}.aac`;
            this.prepareRecordingPath(audioPath);
            AudioRecorder.startRecording();
            this.setState({ recording: true, playing: false, stoppedRecording: false, datedFilePath });
        } else {
            this.stop();
        }
    }
    
    saveAudio = () => {
        const dateCreated = moment(this.state.datedFilePath, 'YYYY-MM-DD HH:mm:ss');
        
        RNFS.moveFile(`${this._recordingLocation}/${this.state.datedFilePath}.aac`, `${this._recordingLocation}/${this.state.fileName}.aac`).then(() => {
            this.props.addRecording(this.state.fileName, dateCreated.format('LLL'), this.state.duration);
            this.setState({fileModalVisible: false});               
        });
    }
    
    deleteRecording = () => {
        this.setState({fileModalVisible: false});
    }

    renderButton = (title, onPress, active) => {
        const style = (active) ? styles.activeButtonText : styles.buttonText;

        return (
        <TouchableHighlight style={styles.button} onPress={onPress}>
            <Text style={style}>
            {title}
            </Text>
        </TouchableHighlight>
        );
    }

    // Add a textInput with the hinttext as the temporary file name
    render() {
        return (
        <View style={styles.container}>
            <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.state.fileModalVisible}
            onRequestClose={() => {alert("Delete Recording?")}}>
                <View style={styles.fileModalContainer}>
                    <View style={styles.fileModal}>
                        <Text>Enter a name for this recording</Text>
                        <Text>{this._recordingLocation}</Text>
                        <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(fileName) => this.setState({fileName})}
                        value={this.state.fileName}/>
                        <TouchableHighlight style={styles.deleteButton} onPress={() => { this.deleteRecording(); }}>
                            <Text>Delete</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.saveButton} onPress={() => {this.saveAudio();}}>
                            <Text>Save</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
            <View style={styles.controls}>
                <TouchableHighlight onPress={() => {this.startOrStopRecording()}}>
                    <View style={this.state.recording ? styles.stopButton : styles.recordButton}></View>
                </TouchableHighlight>
                <Text style={styles.progressText}>{this.state.currentTime}s</Text>
                {this.renderButton("PLAY", () => {this.play()}, this.state.playing )}
                {this.renderButton("PAUSE", () => {this.pause()} )}
            </View>
        </View>
        );
    }
    }

    var styles = StyleSheet.create({
        container: {
            flex: 4
        },
        controls: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
        },
        progressText: {
            paddingTop: 50,
            fontSize: 50,
            color: "#fff"
        },
        button: {
            padding: 20
        },
        disabledButtonText: {
            color: '#eee'
        },
        buttonText: {
            fontSize: 20,
            color: "#fff"
        },
        activeButtonText: {
            fontSize: 20,
            color: "#B81F00"
        },
        recordButton: {
            flex: 1,
            backgroundColor: "#C10",
            width: 100,
            height: 100,
            borderRadius: 50
        },
        stopButton: {
            flex: 1,
            backgroundColor: "#C10",
            width: 100,
            height: 100
        },
        filePathBox: {
            
        },
        saveButton: {
            
        },
        deleteButton: {
            
        },
        fileModalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 150,
        },
        fileModal: {
            height: 120,
            width: 350,
            backgroundColor: 'white',
            borderRadius: 10
        }
  });