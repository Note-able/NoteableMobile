import React, { Component, PropTypes } from 'react';

import {
  Button,
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
import { Modal, RecentRecordings } from '../../components/Shared';
import { DisplayTime, MapRecordingFromDB } from '../../mappers/recordingMapper';
import styles from './audio-styles.js';

// RNFetchBlob.fs.lstat(`${AudioUtils.DocumentDirectoryPath}`).then((result) => {
//   console.log(result.filename);
//   result.forEach(r => RNFetchBlob.fs.unlink(r.path));
// });

const realm = new Realm(Schemas.RecordingSchema);
const WINDOW_WIDTH = Dimensions.get('window').width;
const SAMPLE_RATE = 22050;
const untitled = realm.objects('Recording').filtered('name BEGINSWITH "Untitled "');
let untitledTitle = [...untitled].filter(x => x.name.split(' ').length === 2).map(x => parseInt(x.name.split(' ')[1], 10)).sort((a, b) => b - a)[0] + 1;
console.log([...untitled].filter(x => x.name.split(' ').length === 2));

export default class Audio extends Component {
  state = {
    currentTime: 0.0,
    recording: false,
    stoppedRecording: false,
    isPlaying: false,
    reviewMode: false,
    finished: false,
    fileName: `Untitled ${untitledTitle}`,
    recordingLeft: 0,
    recentRecordings: [...(realm.objects('Recording').sorted('id', true)).map(x => MapRecordingFromDB(x))],
    didSave: false,
    stopTiming: true,
    displayTime: DisplayTime(0),
  };

  componentDidMount() {
    this._recordingLocation = AudioUtils.DocumentDirectoryPath;
    this._recentRecordings = realm.objects('Recording').sorted('id', true);
    realm.addListener('change', this.recordingsChange);

    AudioRecorder.onProgress = () => {};
    AudioRecorder.onFinished = () => this.toggleTiming();
  }

  componentWillUnmount() {
    if (!this.state.didSave) {
      RNFetchBlob.fs.unlink(this.state.audioPath);
    }
  }

  recordingsChange = () => this.setState({
    recentRecordings: [...this._recentRecordings.map(x => MapRecordingFromDB(x))],
  });

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

    this.interval = setInterval(() => {
      const currentTime = (new Date() - this.state.start);
      this.setState({
        currentTime,
        displayTime: DisplayTime(currentTime),
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
    const audio = new Sound(this.state.audioPath, '', (error) => {
      if (error || audio.getDuration === -1) {
        console.warn(`${error.message}`);
        return;
      }

      realm.write(() => {
        realm.create(Schemas.RecordingSchema.schema[0].name, {
          name: this.state.fileName,
          path: this.state.audioPath,
          date: moment.utc().format(),
          duration: audio.getDuration(),
          description: '',
          isSynced: false,
          id: Schemas.GetId(realm.objects('Recording')) + 1,
        });

        if (this.state.fileName === `Untitled ${untitledTitle}`) {
          untitledTitle += 1;
          this.setState({
            fileName: `Untitled ${untitledTitle}`,
          });
        }

        this.setState({
          audioPath: '',
          currentTime: 0,
          reviewMode: false,
          displayTime: DisplayTime(0),
          detailsModal: false,
        });
      });
    });
  }

  deleteRecording = () => {
    RNFetchBlob.fs.unlink(this.state.audioPath);
    this.setState({
      audioPath: '',
      currentTime: 0,
      reviewMode: false,
      displayTime: DisplayTime(0),
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
      <TouchableHighlight style={styles.saveButton} onPress={() => this.showModal()}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableHighlight>
    </View>
    );

  renderModal = (acceptText, cancelText, onAccept, onCancel, title, children) => {
    this.setState({
      modal: (
        <Modal
          acceptText={acceptText}
          cancelText={cancelText}
          onAccept={onAccept}
          onCancel={() => { this.setState({ modal: null }); onCancel(); }}
          title={title}
        >
          {children}
        </Modal>
      ),
    });
  }

  showModal = () => {
    this.renderModal(
      'Save',
      'Cancel',
      this.saveAudio,
      () => {},
      'Details',
      [
        <Text style={styles.inputLabel} key="name">Name</Text>,
        <TextInput style={styles.inputField} key="name-input" onChangeText={name => this.setState({ fileName: name })} value={this.state.fileName} />,
        <Text style={styles.inputLabel} key="tags">Tags</Text>,
        <TextInput style={styles.inputField} key="tags-input" onChangeText={tags => this.setState({ tags })} value={this.state.tags} />,
      ],
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
            <Text style={[styles.progressText, this.state.displayTime.length > 7 ? { width: 125 } : null]}>{this.state.displayTime}</Text>
          </View>
          { this.state.reviewMode ? (this.state.isPlaying ? this.renderPauseButton() : this.renderPlayButton()) : null}
        </View>
        { this.renderRecordingButton() }
        {this.state.reviewMode ? this.renderSaveButton() : null }
        <RecentRecordings
          sampleRate={SAMPLE_RATE}
          recentRecordings={this.state.recentRecordings}
          renderModal={this.renderModal}
        />
        {this.state.modal}
      </View>
    );
  }
}
