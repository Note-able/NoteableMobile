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
    Platform,
    PermissionsAndroid,
} from 'react-native';
import moment from 'moment';

import { AudioRecorder, AudioUtils } from 'react-native-audio';
import Sound from 'react-native-sound';
import RNFetchBlob from 'react-native-fetch-blob';

import { recordingLocation } from '../../constants';
import styles from './audio-styles.js';

const WINDOW_WIDTH = Dimensions.get('window').width;
// /Users/MichaelNakayama/Library/Developer/CoreSimulator/Devices
// 7367BBA6-F432-45C2-ABAD-266283F9633E/data/Containers/Data/Application/
// E1AC6520-2237-405B-A69E-6703072D3584/Documents/test.aac

export default class Audio extends Component {
  static propTypes = {
    addRecording: PropTypes.func.isRequired,
  }

  state = {
    currentTime: 0.0,
    recording: false,
    stoppedRecording: false,
    isPlaying: false,
    reviewMode: false,
    finished: false,
    fileName: `${moment().format('YYYY-MM-DD HHmmss')}`,
  };

  componentDidMount() {
    this._recordingLocation = AudioUtils.DocumentDirectoryPath;

    AudioRecorder.onProgress = (data) => {
      console.log(data.currentTime);
      this.setState({ currentTime: Math.floor(data.currentTime) });
    };

    AudioRecorder.onFinished = (data) => {
      console.log(data);
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

  async stop() {
    if (this.state.recording) {
      await AudioRecorder.stopRecording();
    }
  }

  getAudio = () => new Promise((resolve) => {
    const audio = new Sound(this.state.audioPath, '', (error) => {
      if (error) {
        console.warn(`${error.message}`);
      }
      resolve(audio);
    });
  });

  pausePlay = () => {
    this.getAudio()
      .then((audio) => {
        this.timingAnimation.stop();
        audio.pause();
        this.setState({ isPlaying: false, isPaused: true });
      });
  }

  startPlay = () => {
    this.getAudio()
      .then((audio) => {
        const timingBarWidth = this.state.isPaused ? this.state.timingBarWidth : new Animated.Value(0);
        this.setState({ timingBarWidth, isPlaying: true }, () => {
          this.playAndAnimate(audio);
        });
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
      console.log('Finished playing: ', success);
      if (!success) {
        console.warn('FAILED');
      } else {
        this.setState({
          isPaused: false,
          isPlaying: false,
          timingBarWidth: null,
        });
      }
    });
  }

  async toggleRecording(isRecording) {
    if (!isRecording) {
      const datedFilePath = `${moment().format('HHmmss')}`;
      const audioPath = `${this._recordingLocation}/${datedFilePath}.aac`;
      this.prepareRecordingPath(audioPath);
      this.setState({ recording: true, stoppedRecording: false, audioPath });
      await AudioRecorder.startRecording();
    } else {
      // this.stop();
      await AudioRecorder.stopRecording();
      this.setState({ stoppedRecording: true, recording: false });
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
    <View style={{ justifyContent: 'center', alignItems: 'center', height: 100, width: 100 }}>
      <TouchableHighlight onPress={() => { this.toggleRecording(this.state.recording); }}>
        { this.state.recording ?
          <View style={styles.stopButton} /> :
          <Image source={require('../../img/record.png')} style={styles.recordButton} />
        }
      </TouchableHighlight>
    </View>
  );

  renderPlayButton = () => (
    <View style={{ justifyContent: 'center', alignItems: 'center', height: 100, width: 100 }}>
      <TouchableHighlight onPress={this.startPlay}>
        <Image source={require('../../img/play.png')} style={styles.playPauseIcon} />
      </TouchableHighlight>
    </View>
  );

  renderPauseButton = () => (
    <View style={{ justifyContent: 'center', alignItems: 'center', height: 100, width: 100 }}>
      <TouchableHighlight onPress={this.pausePlay}>
        <Image source={require('../../img/pause.png')} style={styles.playPauseIcon} />
      </TouchableHighlight>
    </View>
  )

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
        { this.renderRecordingButton() }
        <View style={styles.fileName}>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.fileNameInput}
            onChangeText={fileName => this.setState({ fileName })}
            value={this.state.fileName}
          />
        </View>
        {this.state.isPlaying ? this.renderPauseButton() : this.renderPlayButton()}
        { this.state.reviewMode ? this.renderSaveCancelButtons() : null }
        <View style={styles.timingBarShadow} />
        {this.state.timingBarWidth ? <Animated.View style={[{ width: this.state.timingBarWidth }, styles.timingBar]} /> : null}
      </View>
    );
  }
}
