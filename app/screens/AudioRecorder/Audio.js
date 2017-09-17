import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Image,
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
import { RecordingModal, Recordings } from '../../components';
import Select from '../../components/Select';
import { DisplayTime } from '../../mappers/recordingMapper';
import styles from './audio-styles.js';
import { colors, colorRGBA } from '../../styles';
import { logErrorToCrashlytics } from '../../util';
import timeSignatures from './time-signatures';

const realm = Schemas.RecordingSchema;
const WINDOW_WIDTH = Dimensions.get('window').width;
const SAMPLE_RATE = 22050;
const metronomeStates = {
  off: 'Off',
  countIn: 'Count In',
  always: 'Always on',
};

export default class Audio extends PureComponent {
  static propTypes = {
    fetchRecordings: PropTypes.func.isRequired,
    downloadRecording: PropTypes.func.isRequired,
    loadingRecordings: PropTypes.bool,
    recordings: PropTypes.shape({}),
    removeRecording: PropTypes.func.isRequired,
    saveRecording: PropTypes.func.isRequired,
    startPlayer: PropTypes.func.isRequired,
    syncDownRecordings: PropTypes.func.isRequired,
    updateRecording: PropTypes.func.isRequired,
    uploadRecording: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({}),
  };

  state = {
    currentTime: 0.0,
    recording: false,
    stoppedRecording: false,
    isPlaying: false,
    reviewMode: false,
    finished: false,
    fileName: `Untitled ${this.props.getRecordingTitle()}`,
    recordingLeft: 0,
    recordings: this.props.recordings || [],
    didSave: false,
    displayTime: DisplayTime(0),
    modal: false,
    isTiming: false,
    metronomeMenuWidth: 0,
    metronomeMenuHeight: 0,
    metronomeMenuOpacity: 0,
    metronomeState: metronomeStates.off,
    metronomeBPM: '120',
    countIn: '2',
    timeSignature: { value: '4,4', display: '4/4' },
  };

  componentDidMount() {
    this._recordingLocation = AudioUtils.DocumentDirectoryPath;
    this.props.fetchRecordings();
    this.metronomeSound = new Sound('metronome.wav', Sound.MAIN_BUNDLE);

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
      recordings: nextProps.recordings,
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
      const { metronomeState } = this.state;
      const datedFilePath = `${moment().format('HHmmss')}`;
      const audioPath = `${this._recordingLocation}/${datedFilePath}.aac`;
      await this.prepareRecordingPath(audioPath);
      this.setState({ recording: true, stoppedRecording: false, audioPath });
      if (metronomeState !== metronomeStates.off) {
        this.startMetronome();
      } else {
        await this.startRecording();
      }
    } else {
      let modal = true;
      let reviewMode = true;
      if (this.metronomeInterval) {
        clearInterval(this.metronomeInterval);
        this.metronomeInterval = null;
      }
      const { recording } = this.state;
      if (recording) {
        await AudioRecorder.stopRecording();
      } else {
        modal = false;
        reviewMode = false;
      }
      this.setState({ stoppedRecording: true, recording: false, reviewMode, modal });
    }
  }

  async startRecording() {
    try {
      this.toggleTiming();
      await AudioRecorder.startRecording();
    } catch (err) {
      logErrorToCrashlytics(err);
    }
  }

  saveAudio = (recording) => {
    const audio = new Sound(this.state.audioPath, '', (error) => {
      if (error || audio.getDuration === -1) {
        logErrorToCrashlytics(`${error.message}`);
        return;
      }

      let untitledTitle = this.props.getRecordingTitle();

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

  uploadRecording = (recording) => {
    this.props.uploadRecording(recording, this.props.currentUser);
  }

  toggleMetronomeSettings = () => {
    const { showMetronomeMenu } = this.state;
    const metronomeMenuWidth = showMetronomeMenu ? this.state.metronomeMenuWidth : new Animated.Value(0);
    const metronomeMenuHeight = showMetronomeMenu ? this.state.metronomeMenuHeight : new Animated.Value(0);
    this.setState({ metronomeMenuWidth, metronomeMenuHeight, showMetronomeMenu: !showMetronomeMenu }, () => {
      this.metronomeTimingAnimation = Animated.parallel([
        Animated.timing(
          this.state.metronomeMenuWidth,
          {
            easing: Easing.linear,
            toValue: showMetronomeMenu ? 0 : WINDOW_WIDTH,
            duration: 150,
          },
        ),
        Animated.timing(
          this.state.metronomeMenuHeight,
          {
            easing: Easing.linear,
            toValue: showMetronomeMenu ? 0 : 50,
            duration: 150,
          },
        ),
      ]);
      this.metronomeTimingAnimation.start(() => this.setState({ metronomeMenuVisible: !showMetronomeMenu }));
    });
  }

  handleChangeMetronomeState = () => {
    this.setState((prevState) => {
      const { metronomeState } = prevState;
      switch (metronomeState) {
        case metronomeStates.off:
          return { metronomeState: metronomeStates.countIn };
        case metronomeStates.countIn:
          return { metronomeState: metronomeStates.always };
        default:
          return { metronomeState: metronomeStates.off };
      }
    });
  }

  handleChangeBPM = (text) => {
    if (!text) {
      this.setState({ metronomeBPM: text });
    } else {
      const BPM = parseInt(text, 10);
      if (!isNaN(BPM) && BPM <= 400) {
        this.setState({ metronomeBPM: BPM.toString() });
      }
    }
  }

  handleChangeCountIn = (text) => {
    if (!text) {
      this.setState({ countIn: text });
    } else {
      const countIn = parseInt(text, 10);
      if (!isNaN(countIn) && countIn <= 16) {
        this.setState({ countIn: countIn.toString() });
      }
    }
  }

  startMetronome = () => {
    const { metronomeState, metronomeBPM, countIn, timeSignature } = this.state;
    if (metronomeState === metronomeStates.off || metronomeBPM.length === 0 || countIn.length === 0) {
      return;
    }

    const [beatCount, barCount] = timeSignature.value.split(',');
    const BPM = parseInt(metronomeBPM, 10);
    this.metronomeCount = 0;
    this.metronomeInterval = setInterval(() => this.playMetronome(parseInt(countIn, 10) * beatCount, barCount, metronomeState === metronomeStates.countIn), 60000 / BPM);
  }

  playMetronome = (countLimit, barCount, countIn) => {
    if (this.metronomeCount === countLimit) {
      this.startRecording();
      if (countIn) {
        clearInterval(this.metronomeInterval);
        this.metronomeInterval = null;
      } else {
        this.metronomeSound.play();
        this.metronomeCount += 1;
      }
    } else {
      this.metronomeSound.play();
      this.metronomeCount += 1;
    }
  }

  render() {
    const { metronomeMenuVisible, showMetronomeMenu, metronomeMenuWidth, metronomeMenuHeight, metronomeBPM, metronomeState, displayTime, reviewMode, recording, modal, fileName, countIn, timeSignature } = this.state;
    const metronomeMenuProps = { metronomeMenuVisible, showMetronomeMenu, metronomeMenuWidth, metronomeMenuHeight, metronomeState, metronomeBPM, countIn, timeSignature };
    return (
      <View style={styles.container}>
        <LinearGradient
          start={{ x: 1.0, y: 0.0 }}
          end={{ x: 0.1, y: 0.9 }}
          locations={[0.1, 0.3, 0.8]}
          colors={[colorRGBA.red, colorRGBA.lightRed, colors.shade0]}
          style={{ position: 'absolute', width: 600, height: 600, top: -300, right: -300, borderRadius: 300 }}
        />
        <TouchableOpacity onPress={this.toggleMetronomeSettings}>
          <Image source={metronomeState === metronomeStates.off ? require('../../img/metronome.png') : require('../../img/metronome_green.png')} style={{ width: 30, height: 40, margin: 10 }} />
        </TouchableOpacity>
        <MetronomeMenu
          {...metronomeMenuProps}
          onMetronomeStateChange={this.handleChangeMetronomeState}
          onBPMChange={this.handleChangeBPM}
          onCountInChange={this.handleChangeCountIn}
          onTimeSigantureChange={value => this.setState({ timeSignature: value })}
        />
        <Text style={{ fontSize: 20, color: 'white', paddingTop: 28, backgroundColor: 'transparent' }}>Recording Time</Text>
        <View style={[styles.detailsContainer, reviewMode ? { justifyContent: 'center' } : { justifyContent: 'center' }]}>
          <View style={styles.progressTextContainer}>
            <Text style={[styles.progressText, displayTime.length > 7 ? { width: 110 } : null]}>{displayTime}</Text>
          </View>
        </View>
        <View style={[styles.buttonContainer, { marginBottom: 75 }]}>
          <TouchableHighlight onPress={() => { this.toggleRecording(recording); }}>
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
            downloadRecording={this.props.downloadRecording}
            recordings={this.state.recordings}
            startPlayer={this.props.startPlayer}
            editRecording={this.editRecording}
            uploadRecording={this.uploadRecording}
            syncDownRecordings={this.props.syncDownRecordings}
            removeRecording={this.props.removeRecording}
            currentUser={this.props.currentUser}
            loadingRecordings={this.props.loadingRecordings}
          />
        </View>
        <Modal
          animationType={'slide'}
          transparent
          visible={modal}
          onRequestClose={() => { this.setState({ modal: true }); }}
        >
          <RecordingModal
            initialValue={fileName}
            cancel={() => {
              this.setState({ modal: false });
              if (modal.id == null) {
                this.deleteRecording();
              }
            }}
            cancelText={modal.id == null ? 'Delete' : 'Cancel'}
            save={recordingInfo => (modal.id == null ? this.saveAudio(recordingInfo) : this.updateRecording(recordingInfo))}
          />
        </Modal>
      </View>
    );
  }
}

const MetronomeMenu = ({ metronomeMenuVisible, showMetronomeMenu, metronomeMenuWidth, metronomeMenuHeight, metronomeState, metronomeBPM, countIn, timeSignature, onMetronomeStateChange, onBPMChange, onCountInChange, onTimeSigantureChange }) => {
  return (
    <View style={{ height: 50, width: WINDOW_WIDTH, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[styles.metronomeMenuContainer, { width: metronomeMenuWidth, height: metronomeMenuHeight }]}>
        {showMetronomeMenu && (<View style={[styles.metronomeMenu, { opacity: metronomeMenuVisible ? 1 : 0 }]}>
          <TouchableHighlight onPress={onMetronomeStateChange} style={styles.metronomeMenuTouchableHighlight}>
            <Text style={[styles.metronomeLabel, metronomeState !== metronomeStates.off ? styles.metronomeOnText : null, { width: 90 }]}>{ metronomeState }</Text>
          </TouchableHighlight>
          <Text style={styles.metronomeLabel}>BPM:</Text>
          <TextInput
            onChangeText={onBPMChange}
            value={metronomeBPM}
            style={styles.metronomeInput}
            underlineColorAndroid="transparent"
          />
          <Text style={styles.metronomeLabel}>Count In:</Text>
          <TextInput
            onChangeText={onCountInChange}
            value={countIn}
            style={styles.metronomeInput}
            underlineColorAndroid="transparent"
          />
          <Select
            onValueChange={onTimeSigantureChange}
            selectedValue={timeSignature}
            options={timeSignatures}
          />
        </View>)}
      </Animated.View>
    </View>
  );
};

