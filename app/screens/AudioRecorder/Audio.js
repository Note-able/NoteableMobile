import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  View,
  TouchableHighlight,
  Animated,
  Dimensions,
  Modal,
  Easing,
} from 'react-native';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import Sound from 'react-native-sound';
import RNFetchBlob from 'react-native-fetch-blob';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Schemas from '../../realmSchemas';
import { CustomModal, Recordings } from '../../components/Shared';
import { DisplayTime } from '../../mappers/recordingMapper';
import styles from './audio-styles.js';
import { colors, colorRGBA } from '../../styles';
import { logErrorToCrashlytics } from '../../util';

// RNFetchBlob.fs.lstat(`${AudioUtils.DocumentDirectoryPath}`).then((result) => {
//   console.log(result.filename);
//   result.forEach(r => RNFetchBlob.fs.unlink(r.path));
// });

const realm = Schemas.RecordingSchema;
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
    startPlayer: PropTypes.func.isRequired,
    updateRecording: PropTypes.func.isRequired,
    uploadRecording: PropTypes.func.isRequired,
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
    displayTime: DisplayTime(0),
    modal: false,
    isTiming: false,
  };

  componentDidMount() {
    this._recordingLocation = AudioUtils.DocumentDirectoryPath;
    this.props.fetchRecordings();

    AudioRecorder.onProgress = () => {};
    AudioRecorder.onFinished = () => {
      RNFetchBlob.fs.stat(this.state.audioPath)
        .then(stats => this.setState({ fileStats: stats }));

      this.toggleTiming();
    };
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
        isTiming: true,
      });
    }, 50);
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
        logErrorToCrashlytics(`${error.message}`);
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
    audio.play(() => {
      this.setState({
        isPaused: false,
        isPlaying: false,
        timingBarWidth: null,
      });
    });
  }

  async toggleRecording(isRecording) {
    if (!isRecording) {
      const datedFilePath = `${moment().format('HHmmss')}`;
      const audioPath = `${this._recordingLocation}/${datedFilePath}.aac`;
      await this.prepareRecordingPath(audioPath);
      this.setState({ recording: true, stoppedRecording: false, audioPath });
      try {
        this.toggleTiming();
        await AudioRecorder.startRecording();
      } catch (err) {
        logErrorToCrashlytics(err);
      }
    } else {
      await AudioRecorder.stopRecording();
      this.setState({ stoppedRecording: true, recording: false, reviewMode: true, modal: true });
    }
  }

  saveAudio = (recording) => {
    const audio = new Sound(this.state.audioPath, '', (error) => {
      if (error || audio.getDuration === -1) {
        logErrorToCrashlytics(`${error.message}`);
        return;
      }

      this.props.saveRecording({
        name: recording.fileName,
        path: this.state.audioPath,
        dateCreated: moment.utc().toDate(),
        dateModified: moment.utc().toDate(),
        duration: audio.getDuration(),
        description: '',
        isSynced: false,
        size: this.state.fileStats.size,
        id: Schemas.GetId(realm.objects('Recording')) + 1,
      });

      if (recording.fileName === `Untitled ${untitledTitle}`) {
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
        fileStats: null,
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

  editRecording = (recording) => {
    this.setState({
      modal: {
        id: recording.id,
        name: recording.name,
      },
      fileName: recording.name,
      recording,
    });
  }

  updateRecording = (recordingInfo) => {
    this.props.updateRecording({
      ...this.state.recording,
      name: recordingInfo.fileName,
      tags: recordingInfo.tags,
    });

    this.setState({
      recording: null,
      modal: null,
      fileName: '',
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          start={{ x: 1.0, y: 0.0 }}
          end={{ x: 0.1, y: 0.9 }}
          locations={[0.1, 0.3, 0.8]}
          colors={[colorRGBA.red, colorRGBA.lightRed, colors.shade0]}
          style={{ position: 'absolute', width: 600, height: 600, top: -300, right: -300, borderRadius: 300 }}
        />
        <Text style={{ fontSize: 20, color: 'white', paddingTop: 28, backgroundColor: 'transparent' }}>Recording Time</Text>
        <View style={[styles.detailsContainer, this.state.reviewMode ? { justifyContent: 'center' } : { justifyContent: 'center' }]}>
          <View style={styles.progressTextContainer}>
            <Text style={[styles.progressText, this.state.displayTime.length > 7 ? { width: 110 } : null]}>{this.state.displayTime}</Text>
          </View>
        </View>
        <View style={[styles.buttonContainer, { marginBottom: 75 }]}>
          <TouchableHighlight onPress={() => { this.toggleRecording(this.state.recording); }}>
            { this.state.recording ?
              <View style={styles.stopButton} /> :
              <View style={styles.recordButton}>
                <Icon name="mic" size={40} style={{ width: 40, height: 40, margin: 10 }} color={'white'} />
              </View>
            }
          </TouchableHighlight>
        </View>
        <View style={styles.recordingsContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Recent</Text>
            <TouchableHighlight onPress={() => { this.props.navigation.navigate('Recordings'); }}>
              <Text style={styles.navigateRecordings}>{'Recordings >'}</Text>
            </TouchableHighlight>
          </View>
          <Recordings
            deleteRecording={this.props.deleteRecording}
            recordings={this.state.recordings}
            startPlayer={this.props.startPlayer}
            loadingRecordings={this.props.loadingRecordings}
            editRecording={this.editRecording}
            uploadRecording={this.props.uploadRecording}
          />
        </View>
        <Modal
          animationType={'slide'}
          transparent
          visible={this.state.modal}
        >
          <CustomModal
            initialValue={this.state.fileName}
            cancel={() => {
              this.setState({ modal: false });
              this.deleteRecording();
            }}
            cancelText="Delete"
            save={recordingInfo => (this.state.modal.id == null ? this.saveAudio(recordingInfo) : this.updateRecording(recordingInfo))}
          />
        </Modal>
      </View>
    );
  }
}
