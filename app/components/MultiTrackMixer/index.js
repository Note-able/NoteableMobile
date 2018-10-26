import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { AudioUtils } from 'react-native-audio';
import moment from 'moment';
import RNFetchBlob from 'react-native-fetch-blob';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RecordingModal } from '../../components';
import Schemas from '../../realmSchemas';
import { colors } from '../../styles';
import Recording from '../Recording';
import { MultiTrack } from '../../nativeModules';
import styles from './styles';

const OPTIONS_WIDTH = 100;

export default class MultiTrackMixer extends React.PureComponent {
  static propTypes = {
    recordings: PropTypes.shape({
      local: PropTypes.object.isRequired,
      networked: PropTypes.object.isRequired,
      order: PropTypes.arrayOf(PropTypes.number),
    }),
    saveMix: PropTypes.func.isRequired,
    toggleMixer: PropTypes.func.isRequired,
    isMixerOn: PropTypes.bool,
  };

  state = {
    selectedRecordings: [],
    tracksToAdd: [],
    modal: { visible: false },
  };

  selectTrack = (recording) => {
    const { tracksToAdd } = this.state;
    tracksToAdd.push(recording);
    this.setState({ tracksToAdd });
  };

  unselectTrack = (recording) => {
    const { tracksToAdd } = this.state;
    tracksToAdd.splice(tracksToAdd.findIndex(r => r.id === recording.id), 1);
    this.setState({ tracksToAdd });
  };

  addTracks = () => {
    const { tracksToAdd } = this.state;
    tracksToAdd.forEach((recording) => {
      const splits = recording.path.split('/');
      const realPath = `${AudioUtils.DocumentDirectoryPath}/${splits[splits.length - 1]}`;
      MultiTrack.AddTrack(`${recording.id}`, realPath);
    });
    this.setState({
      tracksToAdd: [],
      modal: { visible: false },
      selectedRecordings: [...this.state.selectedRecordings, ...tracksToAdd],
    });
  };

  cancelAddTracks = () => {
    this.setState({ tracksToAdd: [], modal: { visible: false } });
  };

  removeTrack = (recording) => {
    MultiTrack.RemoveTrack(`${recording.id}`);
    const { selectedRecordings } = this.state;
    const index = selectedRecordings.findIndex(r => r.id === recording.id);
    selectedRecordings.splice(index, 1);
    this.setState(state => ({ selectedRecordings, showOptions: null, [state.showOptions]: null }));
  };

  createAnimations = (recordingId) => {
    const animations = [];
    let oldOptions = null;

    if (this.state.showOptions) {
      oldOptions = this.state.showOptions;
    }

    this.setState({
      showOptions: this.props.recordings.order.find(x => x === recordingId),
    });

    if (oldOptions == null || oldOptions !== recordingId) {
      animations.push(
        Animated.spring(this.state[recordingId], {
          easing: Easing.quad,
          toValue: 1,
          duration: 100,
        }),
      );
    }

    if (oldOptions != null) {
      if (oldOptions === recordingId) {
        this.setState({
          showOptions: null,
        });
      }

      animations.push(
        Animated.spring(this.state[oldOptions], {
          easing: Easing.linear,
          toValue: 0,
          duration: 50,
        }),
      );
    }

    Animated.parallel(animations).start();
  };

  showOptions = (recordingId) => {
    if (this.state[recordingId] == null) {
      this.setState(
        {
          [recordingId]: new Animated.Value(0),
        },
        () => this.createAnimations(recordingId),
      );
    } else {
      this.createAnimations(recordingId);
    }
  };

  showRecordingSelector = () => this.setState({ modal: { visible: true, content: 'recordings' } });

  showSaveDialog = () => this.setState({ modal: { visible: true, content: 'save' } });

  togglePlay = () => {
    const { isPlaying } = this.state;
    if (isPlaying) {
      this.setState({ isPlaying: false }, () => {
        MultiTrack.Stop();
      });
    } else {
      this.setState({ isPlaying: true }, () => {
        MultiTrack.Start().then(() => this.setState({ isPlaying: false }));
      });
    }
  };

  saveMix = async ({ fileName, tags }) => {
    const { selectedRecordings } = this.state;
    const filePath = `${AudioUtils.DocumentDirectoryPath}/${fileName.replace(/\s/g, '_')}`;
    await MultiTrack.WriteMixToFile(`${filePath}`);
    const stats = await RNFetchBlob.fs.stat(`${filePath}.aac`);
    this.props.saveMix({
      name: fileName,
      path: `${filePath}.aac`,
      dateCreated: moment.utc().toDate(),
      dateModified: moment.utc().toDate(),
      duration: Math.max(...selectedRecordings.map(x => x.duration)),
      description: '',
      isSynced: false,
      size: stats.size,
      id: Schemas.GetId(Schemas.RecordingSchema.objects('Recording')) + 1,
      tags,
    });
    this.setState({ modal: { visible: false } });
  };

  renderRecordingsModalContent = () => {
    const { recordings } = this.props;
    const { selectedRecordings, tracksToAdd } = this.state;
    return (
      <View style={styles.modal}>
        <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.modalItems}>
          {recordings.order
            .filter(x => selectedRecordings.findIndex(r => r.id === x) === -1)
            .map((recordingId) => {
              const recording = recordings.local[recordingId] || recordings.networked[recordingId];
              const selected = tracksToAdd.findIndex(x => x.id === recordingId) !== -1;
              return (
                <TouchableOpacity
                  style={{ width: '100%' }}
                  key={recording.id}
                  onPress={() => {
                    if (selected) {
                      this.unselectTrack(recording);
                    } else {
                      this.selectTrack(recording);
                    }
                  }}
                >
                  <View style={styles.modalRecordingContainer}>
                    <Icon
                      name={selected ? 'check-box' : 'check-box-outline-blank'}
                      size={20}
                      color={colors.white}
                    />
                    <Text
                      style={{ marginLeft: 20, color: colors.white, flex: 2 }}
                      numberOfLines={1}
                    >
                      {recording.name}
                    </Text>
                    <Text style={{ marginLeft: 20, color: colors.medium, flex: 1 }}>
                      {moment.utc(recording.duration * 1000).format('mm:ss')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            onPress={() => this.setState({ modal: { visible: false } })}
            style={styles.modalCancelButton}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.addTracks} style={styles.modalAddButton}>
            <Text style={styles.modalButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderSaveModalContent = () => (
    <RecordingModal
      initialValue={''}
      cancel={this.cancelAddTracks}
      cancelText={'Delete'}
      save={this.saveMix}
    />
  );

  render() {
    const { isMixerOn, toggleMixer } = this.props;
    const { selectedRecordings, modal, showOptions, isPlaying } = this.state;

    return (
      <View>
        <View style={styles.multiTrackHeader}>
          <TouchableOpacity onPress={this.togglePlay}>
            <Icon name={isPlaying ? 'stop' : 'play-arrow'} size={25} color={colors.green} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={selectedRecordings.length !== 0 ? this.showSaveDialog : null}
            >
              <Icon name={'save'} size={25} style={styles.headerIcon} color={colors.green} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleMixer}>
              <Icon
                name={isMixerOn ? 'layers' : 'layers-clear'}
                size={25}
                style={styles.headerIcon}
                color={isMixerOn ? colors.green : colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.showRecordingSelector}>
              <Icon name="add" size={25} style={styles.headerIcon} color={colors.green} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.recordingsContainer}>
          {selectedRecordings.map(recording => (
            <View key={recording.id}>
              <View
                style={[
                  styles.rowOptions,
                  { width: OPTIONS_WIDTH, position: 'absolute', right: 0 },
                ]}
              >
                <TouchableOpacity onPress={() => this.removeTrack(recording)}>
                  <Icon name="close" size={20} color={colors.red} />
                </TouchableOpacity>
              </View>
              <Animated.View
                style={[
                  styles.row,
                  this.state[recording.id] == null
                    ? null
                    : {
                      transform: [
                        {
                          translateX: this.state[recording.id].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -1 * OPTIONS_WIDTH],
                          }),
                        },
                      ],
                    },
                ]}
              >
                <Recording
                  name={recording.name}
                  openMoreMenu={() => this.showOptions(recording.id)}
                  isOpen={showOptions === recording.id}
                  secondaryDetails={recording.durationDisplay}
                  primaryDetails={moment(recording.dateCreated).format('MM/DD/YYYY')}
                />
              </Animated.View>
            </View>
          ))}
        </ScrollView>
        <Modal
          visible={modal.visible}
          transparent
          animationType="slide"
          onRequestClose={() => {
            this.setState({ modal: { visible: false } });
          }}
        >
          {modal.content === 'recordings' ? this.renderRecordingsModalContent() : null}
          {modal.content === 'save' ? this.renderSaveModalContent() : null}
        </Modal>
      </View>
    );
  }
}
