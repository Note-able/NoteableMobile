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
import Realm from 'realm';

import Schemas from '../../realmSchemas';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RecentRecordings } from '../../components/Shared';
import styles from './audio-styles.js';

const realm = new Realm(Schemas.RecordingSchema);
const WINDOW_WIDTH = Dimensions.get('window').width;
const SAMPLE_RATE = 22050;

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
    recordingLeft: 0,
    recentRecordings: [],
    didSave: false,
    stopTiming: true,
    displayTime: '00:00:00.0',
  };

  componentDidMount() {
    this._recordingLocation = AudioUtils.DocumentDirectoryPath;
    RNFetchBlob.fs.lstat(AudioUtils.DocumentDirectoryPath).then((result) => {
      this.setState({
        recentRecordings: result.filter(x => x.type === 'file').sort((a, b) => b.lastModified - a.lastModified).slice(0, 5),
      });
    });

    AudioRecorder.onProgress = (data) => {

    };

    AudioRecorder.onFinished = () => {
      this.toggleTiming();
    };
  }

  componentWillUnmount() {
    if (!this.state.didSave) {
      RNFetchBlob.fs.unlink(this.state.audioPath);
    }
  }

  toggleTiming = () => {
    if (this.state.isTiming) {
      clearInterval(this.interval);
      this.setState({
        isTiming: false,
      });

      return;
    }

    this.setState({
      start: new Date(),
      isTiming: true,
    });

    console.time('start');

    this.interval = setInterval(() => {
      const currentTime = (new Date() - this.state.start);
      console.timeEnd('start');
      console.log(new Date() - this.state.start);
      this.setState({
        currentTime,
        displayTime: this.displayTime(currentTime),
      });
    }, 90);
  }

  async prepareRecordingPath(audioPath) {
    await AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: SAMPLE_RATE,
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

  chooseRecording = recording => new Promise((resolve) => {
    const audio = new Sound(recording.path, '', (error) => {
      if (error) {
        console.warn(error.message);
      }

      resolve(audio);
    });
  })

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
      await this.prepareRecordingPath(audioPath);
      this.setState({ recording: true, stoppedRecording: false, audioPath });
      try {
        await AudioRecorder.startRecording();
        this.toggleTiming();
      } catch (err) {
        console.warn(err);
      }
    } else {
      await AudioRecorder.stopRecording();
      this.setState({ stoppedRecording: true, recording: false, reviewMode: true });
    }
  }

  saveAudio = () => {
    realm.write(() => {
      realm.create(Schemas.RecordingSchema.schema[0].name, {

      });
    });
  }

  deleteRecording = () => {
    RNFetchBlob.fs.unlink(this.state.audioPath);
    this.setState({
      audioPath: '',
      currentTime: 0,
      reviewMode: false,
    });
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
    <View style={[styles.buttonContainer, this.state.reviewMode ? { marginBottom: 50 } : { marginBottom: 150 }]}>
      <TouchableHighlight onPress={() => { this.toggleRecording(this.state.recording); }}>
        { this.state.recording ?
          <View style={styles.stopButton} /> :
          <View style={styles.recordButton}>
            <Icon name="mic" size={40} style={{ width: 40, height: 40, margin: 10 }} color={'white'} />
          </View>
        }
      </TouchableHighlight>
    </View>
  );

  renderPlayButton = () => (
    <View style={styles.buttonContainer}>
      <TouchableHighlight onPress={this.startPlay}>
        <Icon name="play-arrow" size={40} style={{ width: 40, height: 40, margin: 10 }} color={'#31CB94'} />
      </TouchableHighlight>
    </View>
  );

  renderPauseButton = () => (
    <View style={styles.buttonContainer}>
      <TouchableHighlight onPress={this.pausePlay}>
        <Icon name="pause" size={40} style={{ width: 40, height: 40, margin: 10 }} color={'#31CB94'} />
      </TouchableHighlight>
    </View>
  );

  renderDeleteButton = () => (
    <View style={styles.buttonContainer}>
      <TouchableHighlight onPress={this.deleteRecording}>
        <Icon name="delete" size={40} style={{ width: 40, height: 40, margin: 15 }} color={'#31CB94'} />
      </TouchableHighlight>
    </View>
  )

  renderSaveButton = () => (
    <View style={[styles.buttonContainer, styles.saveContainer]}>
      <TouchableHighlight style={styles.saveButton} onPress={() => this.setState({ detailsModal: true })}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableHighlight>
    </View>
    );

  displayTime = (currentTime) => {
    let hour = Math.floor((currentTime / 360000)) % 24;
    let minute = Math.floor((currentTime / 60000)) % 60;
    let second = Math.floor((currentTime / 1000)) % 60;
    const tenth = Math.floor((currentTime / 100)) % 10;

    if (hour < 10) {
      hour = `0${hour}`;
    }

    if (minute < 10) {
      minute = `0${minute}`;
    }

    if (second < 10) {
      second = `0${second}`;
    }

    return `${hour}:${minute}:${second}.${tenth}`;
  }

  renderModal() {
    return (
      <TouchableHighlight style={styles.modalContainer} onPress={() => this.setState({ detailsModal: false })}>
        <View style={styles.modal} />
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.timingBarWidth ? <Animated.View style={[{ width: this.state.timingBarWidth }, styles.timingBar]} /> : null}
        <View style={styles.timingBarShadow} />
        <Text style={{ fontSize: 20, color: 'white', paddingTop: 28 }}>Recording Time</Text>
        <View style={[styles.detailsContainer, this.state.reviewMode ? { justifyContent: 'center' } : { justifyContent: 'center' }]}>
          { this.state.reviewMode ? this.renderDeleteButton() : null}
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>{this.state.displayTime}</Text>
          </View>
          { this.state.reviewMode ? (this.state.isPlaying ? this.renderPauseButton() : this.renderPlayButton()) : null}
        </View>
        { this.renderRecordingButton() }
        {true ? null :
        <View style={styles.fileName}>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.fileNameInput}
            onChangeText={fileName => this.setState({ fileName })}
            value={this.state.fileName}
          />
        </View>
        }
        {this.state.reviewMode ? this.renderSaveButton() : null }
        { this.state.detailsModal ? this.renderModal() : null }
        <RecentRecordings sampleRate={SAMPLE_RATE} chooseRecording={this.chooseRecording} recentRecordings={this.state.recentRecordings} />
      </View>
    );
  }
}
