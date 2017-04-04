import React, { Component, PropTypes } from 'react';

import {
    Text,
    View,
    TouchableHighlight,
    Image,
    TextInput,
    Animated,
    Dimensions,
    Easing,
    PermissionsAndroid,
} from 'react-native';
import moment from 'moment';

import { AudioRecorder } from 'react-native-audio';
import Sound from 'react-native-sound';
import RNFetchBlob from 'react-native-fetch-blob';

import { recordingLocation } from '../../constants';
import styles from './audio-styles.js';

const WINDOW_WIDTH = Dimensions.get('window').width;

export default class Audio extends Component {
  static propTypes = {
    addRecording: PropTypes.func.isRequired,
  }

  state = {
    currentTime: 0.0,
    recording: false,
    stoppedRecording: false,
    reviewMode: false,
    finished: false,
    fileName: `${moment().format('YYYY-MM-DD HHmmss')}`,
  };

  componentDidMount() {
    RNFetchBlob.fs.mkdir(recordingLocation);
    this._recordingLocation = recordingLocation;

    AudioRecorder.onProgress = (data) => {
      console.error(data.currentTime);
      this.setState({ currentTime: Math.floor(data.currentTime) });
    };

    AudioRecorder.onFinished = (data) => {
      this.setState({ finished: data.finished });
      console.warn(`Finished recording: ${data.finished}`);
    };
  }

  prepareRecordingPath = (audioPath) => {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000,
    });
  }

  pause = () => {
    if (this.state.recording) {
      AudioRecorder.pauseRecording();
      this.setState({ stoppedRecording: true, recording: false });
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
          toValue: WINDOW_WIDTH,
          duration,
        },
    );
      this.timingAnimation.start();
      this.playSound(audio);
    });
  }

  playSound = (audio) => {
    audio.play((success) => {
      if (!success) { console.warn('FAILED'); } else { this.setState({ paused: true }); }
    });
  }

  startOrStopRecording = () => {
    if (!this.state.recording) {
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

    RNFetchBlob.fs.mv(`${this._recordingLocation}/${this.state.datedFilePath}.aac`, `${this._recordingLocation}/${this.state.fileName}.aac`).then(() => {
      this.props.addRecording(this.state.fileName, dateCreated.format('LLL'), this.state.duration);
      this.setState({ reviewMode: false });
    }).catch(error => console.warn(error));
  }

  deleteRecording = () => {
    this.setState({ reviewMode: false });
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
    <TouchableHighlight onPress={() => { this.startOrStopRecording(); }}>
      { this.state.recording ?
        <View style={styles.stopButton} /> :
        <Image source={require('../../img/record.png')} style={styles.recordButton} />
            }
    </TouchableHighlight>);

  renderPlayButton = () => (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.timingBarShadow} />
      <Animated.View style={[{ width: this.state.timingBarWidth }, styles.timingBar]} />
      <TouchableHighlight
        onPress={() => {
          if (this.state.isPlaying) { this.pausePlay(); } else { this.startPlay(); }
        }}
      >
        <Image source={this.state.isPlaying ? require('../../img/pause.png') : require('../../img/play.png')} style={styles.playPauseIcon} />
      </TouchableHighlight>
    </View>);

  renderSaveCancelButtons = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight style={styles.cancelButton} onPress={() => { this.deleteRecording(); }}>
        <Text style={styles.cancelText}>Delete</Text>
      </TouchableHighlight>
      <TouchableHighlight style={styles.saveButton} onPress={() => { this.saveAudio(); }}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableHighlight>
    </View>
    );

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20 }}>Recording Time</Text>
        <Text style={styles.progressText}>{this.state.currentTime}s</Text>
        { this.state.reviewMode ? this.renderPlayButton() : this.renderRecordingButton() }
        <View style={styles.fileName}>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.fileNameInput}
            onChangeText={fileName => this.setState({ fileName })}
            value={this.state.fileName}
          />
        </View>
        { this.state.reviewMode ? this.renderSaveCancelButtons() : null }
      </View>
    );
  }
}
