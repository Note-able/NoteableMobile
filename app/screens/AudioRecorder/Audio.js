import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  View,
  TouchableHighlight,
  TextInput,
  Animated,
  Dimensions,
  Modal,
  Easing,
} from 'react-native';
import moment from 'moment';

import { AudioRecorder, AudioUtils } from 'react-native-audio';
import Sound from 'react-native-sound';
import RNFetchBlob from 'react-native-fetch-blob';
import Realm from 'realm';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Schemas from '../../realmSchemas';
import { Recordings } from '../../components/Shared';
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
let untitledTitle = [...untitled].filter(x => x.name.split(' ').length === 2).map(x => parseInt(x.name.split(' ')[1], 10)).sort((a, b) => b - a)[0] + 1 || 1;

export default class Audio extends PureComponent {
  static propTypes = {
    fetchRecordings: PropTypes.func.isRequired,
    loadingRecordings: PropTypes.bool,
    recordings: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      duration: PropTypes.number,
      description: PropTypes.string,
      isSynced: PropTypes.bool.isRequired,
      id: PropTypes.number.isRequired,
    })),
    saveRecording: PropTypes.func.isRequired,
  };

  state = {
    currentTime: 0.0,
    recording: false,
    stoppedRecording: false,
    isPlaying: false,
    reviewMode: false,
    finished: false,
    fileName: `Untitled ${untitledTitle}`,
    recordingLeft: 0,
    recordings: this.props.recordings || [],
    didSave: false,
    stopTiming: true,
    displayTime: DisplayTime(0),
    modal: false,
  };

  componentDidMount() {
    this._recordingLocation = AudioUtils.DocumentDirectoryPath;
    this.props.fetchRecordings();

    AudioRecorder.onProgress = () => {};
    AudioRecorder.onFinished = () => this.toggleTiming();
  }

  componentWillUnmount() {
    if (!this.state.didSave) {
      RNFetchBlob.fs.unlink(this.state.audioPath);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      recordings: nextProps.recordings || [],
    });
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
      start: new Date() - 20,
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

      this.props.saveRecording({
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
        modal: false,
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

  render() {
    return (
      <View style={styles.container}>
        {this.state.timingBarWidth ? <Animated.View style={[{ width: this.state.timingBarWidth }, styles.timingBar]} /> : null}
        <View style={styles.timingBarShadow} />
        {/* Details */}
        <Text style={{ fontSize: 20, color: 'white', paddingTop: 28 }}>Recording Time</Text>
        <View style={[styles.detailsContainer, this.state.reviewMode ? { justifyContent: 'center' } : { justifyContent: 'center' }]}>
          { this.state.reviewMode ?
            <View style={styles.buttonContainer}>
              <TouchableHighlight onPress={this.deleteRecording}>
                <Icon name="delete" size={40} style={{ width: 40, height: 40, margin: 15 }} color={'#31CB94'} />
              </TouchableHighlight>
            </View> : null }
          <View style={styles.progressTextContainer}>
            <Text style={[styles.progressText, this.state.displayTime.length > 7 ? { width: 125 } : null]}>{this.state.displayTime}</Text>
          </View>
          { !this.state.reviewMode ? null : (this.state.isPlaying ?
            <View style={styles.buttonContainer}>
              <TouchableHighlight onPress={this.pausePlay}>
                <Icon name="pause" size={40} style={{ width: 40, height: 40, margin: 10 }} color={'#31CB94'} />
              </TouchableHighlight>
            </View> :
            <View style={styles.buttonContainer}>
              <TouchableHighlight onPress={this.startPlay}>
                <Icon name="play-arrow" size={40} style={{ width: 40, height: 40, margin: 10 }} color={'#31CB94'} />
              </TouchableHighlight>
            </View>)}
        </View>
        {/* Recording button */}
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
        {/* Save button */}
        {!this.state.reviewMode ? null :
        <View style={[styles.buttonContainer, styles.saveContainer]}>
          <TouchableHighlight style={styles.saveButton} onPress={() => this.setState({ modal: true })}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableHighlight>
        </View>
        }
        {/* Recent Recordings */}

        <View style={styles.recordingsContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Recent</Text>
            <TouchableHighlight onPress={() => {this.props.goToRecordings(); }}>
              <Text style={styles.navigateRecordings}>{'Recordings >'}</Text>
            </TouchableHighlight>
          </View>
          <Recordings
            recordings={this.state.recordings}
            loadingRecordings={this.props.loadingRecordings}
          />
        </View>
        {/* Modal */}

        <Modal
          animationType={'none'}
          transparent
          visible={this.state.modal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Title</Text>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput style={styles.inputField} onChangeText={name => this.setState({ fileName: name })} value={this.state.fileName} />
              <Text style={styles.inputLabel}>Tags</Text>
              <TextInput style={styles.inputField} onChangeText={tags => this.setState({ tags })} value={this.state.tags} />
              <View style={styles.buttonRow}>
                <TouchableHighlight style={styles.buttonOption} onPress={() => this.setState({ modal: false })}>
                  <Text style={{ textAlign: 'center', color: '#95989A', fontSize: 16 }}>Cancel</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.buttonOption} onPress={() => this.saveAudio()}>
                  <Text style={{ textAlign: 'center', color: '#95989A', fontSize: 16 }}>Save</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
