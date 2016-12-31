import React, {Component} from 'react';

import {
    Text,
    View,
    TouchableHighlight,
    Image,
    TextInput,
    Animated,
    Dimensions,
    Easing,
} from 'react-native';
import moment from 'moment';

import {AudioRecorder, AudioUtils} from 'react-native-audio';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';

import { dbName, recordingsDirectory } from '../../constants';

export default class Audio extends Component {
    constructor(props) {
        super(props);
        
        state = {
            currentTime: 0.0,
            recording: false,
            stoppedRecording: false,
            reviewMode: false,
            finished: false,
            fileName: `${moment().format('YYYY-MM-DD HHmmss')}`,
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
            console.warn(`Finished recording: ${data.finished}`);
        };
    }

    pause = () => {
        if (this.state.recording){
            AudioRecorder.pauseRecording();
            this.setState({stoppedRecording: true, recording: false});
        }
    }

    stop = () => {
        if (this.state.recording) {
            AudioRecorder.stopRecording().then((outputFilePath) => {
                const duration = moment(moment().diff(moment(this.state.datedFilePath, 'YYYY-MM-DD HHmmss'))).format('mm:ss');
                const audio = new Sound(outputFilePath, '', (error) => {
                    if (error) {
                        console.warn(`${error.message}`);
                    } else {
                        this.setState({
                            stoppedRecording: true,
                            recording: false,
                            reviewMode: true,
                            fileName: this.state.datedFilePath,
                            audio,
                            duration,
                        });
                    }
                });
            });
        }
    }

    pausePlay = () => {
        const { audio } = this.state;
        this.timingAnimation.stop();
        audio.pause();
        this.setState({ isPlaying: false, isPaused: true });
    }
    
    startPlay = () => {
        const { audio } = this.state;
        const timingBarWidth = this.state.isPaused ? this.state.timingBarWidth : new Animated.Value(0);
        this.setState({ timingBarWidth, isPlaying: true }, () => {
            this.playAndAnimate(audio);
        });
    }
    
    playAndAnimate(audio) {
        audio.getCurrentTime((time) => {
            const duration = (audio.getDuration() - time) * 1000;
            this.timingAnimation = Animated.timing(
                this.state.timingBarWidth,
                {
                    easing: Easing.linear,
                    toValue: windowWidth,
                    duration
                },
            );
            this.timingAnimation.start();
            this.playSound(audio); 
        });  
    }
    
    playSound = (audio) => {
        audio.play((success) => {
            if(!success)
                console.warn('FAILED');
            else
                this.setState({ paused: true })
        });
    }
    
    startOrStopRecording = () => {
        if(!this.state.recording){
            // react-native-sound fails to load Sound if the name is formated with colons - HH:mm:ss
            const datedFilePath = `${moment().format('YYYY-MM-DD HHmmss')}`;
            const audioPath = `${this._recordingLocation}/${datedFilePath}.aac`;
            this.prepareRecordingPath(audioPath);
            AudioRecorder.startRecording();
            this.setState({ recording: true, stoppedRecording: false, datedFilePath });
        } else {
            this.stop();
        }
    }
    
    saveAudio = () => {
        const dateCreated = moment(this.state.datedFilePath, 'YYYY-MM-DD HH:mm:ss');
        
        RNFS.moveFile(`${this._recordingLocation}/${this.state.datedFilePath}.aac`, `${this._recordingLocation}/${this.state.fileName}.aac`).then(() => {
            this.props.addRecording(this.state.fileName, dateCreated.format('LLL'), this.state.duration);
            this.setState({ reviewMode: false });          
        }).catch(error => console.warn(error));
    }
    
    deleteRecording = () => {
        this.setState({reviewMode: false});
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
    
    renderRecordingButton = () => (
        <TouchableHighlight onPress={() => {this.startOrStopRecording()}}>
            { this.state.recording ? 
                <View style={styles.stopButton}></View> :
                <Image source={require('../../img/record.png')} style={styles.recordButton} />
            }
        </TouchableHighlight>);
        
    renderPlayButton = () => (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.timingBarShadow} />
            <Animated.View style={[{ width: this.state.timingBarWidth }, styles.timingBar]}/>
            <TouchableHighlight onPress={() => { 
                if(this.state.isPlaying)
                    this.pausePlay();
                else
                    this.startPlay(); 
            }}>
                <Image source={this.state.isPlaying ? require('../../img/pause.png') : require('../../img/play.png')} style={styles.playPauseIcon}></Image>
            </TouchableHighlight>
        </View>);
        
    renderSaveCancelButtons = () => (
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <TouchableHighlight style={styles.cancelButton} onPress={() => { this.deleteRecording(); }}>
                <Text style={styles.cancelText}>Delete</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.saveButton} onPress={() => {this.saveAudio();}}>
                <Text style={styles.saveText}>Save</Text>
            </TouchableHighlight>
        </View>
    );
    
    render() {
        return (
        <View style={styles.container}>
            <Text style={{fontSize: 20,}}>Recording Time</Text>
            <Text style={styles.progressText}>{this.state.currentTime}s</Text>
            { this.state.reviewMode ? this.renderPlayButton() : this.renderRecordingButton() }
            <View style={styles.fileName}>
                <TextInput
                    underlineColorAndroid='transparent'
                    style={styles.fileNameInput}
                    onChangeText={(fileName) => this.setState({fileName})}
                    value={this.state.fileName}/>
            </View>
            { this.state.reviewMode ? this.renderSaveCancelButtons() : null }
        </View>
        );
    }
}

/*
            {this.renderButton("PLAY", () => {this.play()}, this.state.playing )}
            {this.renderButton("PAUSE", () => {this.pause()} )}
*/

const windowWidth = Dimensions.get('window').width;
const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timingBar: {
        alignSelf: 'flex-start',
        backgroundColor: '#31CB94',
        height: 3,
        marginTop: -1,
    },
    timingBarShadow: {
        alignSelf: 'flex-start',
        borderBottomColor: '#31CB94',
        width: windowWidth,
        borderBottomWidth: 1,
        height: 0,
    },
    fileName: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    fileNameInput: {
        flex: 1,
        fontSize: 18,
        textAlign: 'center',
        marginHorizontal: 40,
    },
    progressText: {
        fontSize: 50,
        color: "#000"
    },
    recordButton: {
        flex: 1,
        width: 100,
        height: 100,
        borderRadius: 50
    },
    playPauseIcon: {
        flex: 1,
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center'
    },
    stopButton: {
        flex: 1,
        backgroundColor: "#E8163E",
        width: 80,
        height: 80
    },
    saveButton: {
        backgroundColor: '#31CB94',
        borderRadius: 4,
        flex: 1,
        height: 50,
        padding: 4,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
    },
    cancelButton: {
        borderColor: '#E8163E',
        borderWidth: 1,
        borderRadius: 4,
        flex: 1,
        height: 50,
        padding: 4,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelText: {
        color: '#E8163E',
        textAlign: 'center',
        fontSize: 18,
    }
};
  