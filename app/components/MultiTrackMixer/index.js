import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, View, Text, TouchableHighlight, ScrollView, Modal } from 'react-native';
import { AudioUtils } from 'react-native-audio';
import moment from 'moment';

import Recording from '../Recording';
import { MultiTrack } from '../../nativeModules';
import styles from './styles';

const OPTIONS_WIDTH = 100;

/*
recording:
PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  dateCreated: PropTypes.string.isRequired,
  durationDisplay: PropTypes.string.isRequired,
  audioUrl: PropTypes.string,
  isSynced: PropTypes.bool,
  size: PropTypes.number,
}
*/

export default class MultiTrackMixer extends Component {
  static propTypes = {
    recordings: PropTypes.shape({
      local: PropTypes.object.isRequired,
      networked: PropTypes.object.isRequired,
      order: PropTypes.arrayOf(PropTypes.number),
    }),
    removeRecording: PropTypes.func.isRequired,
  }

  state = {
    selectedRecordings: [],
    modalVisible: false,
  }

  addTrack = (recording) => {
    const splits = recording.path.split('/');
    const realPath = `${AudioUtils.DocumentDirectoryPath}/${splits[splits.length - 1]}`;
    MultiTrack.AddTrack(`${recording.id}`, realPath);
    this.setState({ selectedRecordings: [...this.state.selectedRecordings, recording], modalVisible: false });
  }

  removeTrack = (recording) => {
    MultiTrack.RemoveTrack(`${recording.id}`);
    const { selectedRecordings } = this.state;
    const index = selectedRecordings.findIndex(r => r.id === recording.id);
    selectedRecordings.splice(index, 1);
    this.setState({ selectedRecordings });
  }

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
      animations.push(Animated.spring(
        this.state[recordingId], {
          easing: Easing.quad,
          toValue: 1,
          duration: 100,
        }));
    }

    if (oldOptions != null) {
      if (oldOptions === recordingId) {
        this.setState({
          showOptions: null,
        });
      }

      animations.push(Animated.spring(
        this.state[oldOptions], {
          easing: Easing.linear,
          toValue: 0,
          duration: 50,
        }));
    }

    Animated.parallel(animations).start();
  }

  showOptions = (recordingId) => {
    if (this.state[recordingId] == null) {
      this.setState({
        [recordingId]: new Animated.Value(0),
      }, () => this.createAnimations(recordingId));
    } else {
      this.createAnimations(recordingId);
    }
  }

  showRecordingSelector = () => { this.setState({ modalVisible: true }); }

  render() {
    const { recordings } = this.props;
    const { selectedRecordings, modalVisible } = this.state;

    return (
      <View>
        <View style={styles.multiTrackHeader}>
          <TouchableHighlight onPress={() => MultiTrack.Start()}>
            <Text style={styles.multiTrackHeaderControl}>Play</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.showRecordingSelector}>
            <Text style={styles.multiTrackHeaderControl}>Add</Text>
          </TouchableHighlight>
        </View>
        <ScrollView contentContainerStyle={styles.recordingsContainer}>
          { selectedRecordings.map(recording => (
            <View key={recording.id}>
              <View style={[styles.rowOptions, { width: OPTIONS_WIDTH, position: 'absolute', right: 0 }]}>
                <TouchableHighlight onPress={() => this.removeTrack(recording)}>
                  <Text style={styles.removeRecording}>Remove</Text>
                </TouchableHighlight>
              </View>
              <Animated.View
                style={[
                  styles.row,
                  this.state[recording.id] == null ? null : {
                    transform: [{ translateX: this.state[recording.id].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -1 * OPTIONS_WIDTH],
                    }) }],
                  },
                ]}
              >
                <Recording
                  name={recording.name}
                  isPlaying={this.state.activeRecording === recording.id}
                  openMoreMenu={() => this.showOptions(recording.id)}
                  secondaryDetails={recording.durationDisplay}
                  primaryDetails={moment(recording.dateCreated).format('MM/DD/YYYY')}
                />
              </Animated.View>
            </View>
          )) }
        </ScrollView>
        <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => { this.setState({ modalVisible: false }); }}>
          <View style={{backgroundColor: 'black', marginTop: 100}}>
            <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.modalItems}>
              {recordings.order.map((recordingId) => {
                const recording = recordings.local[recordingId] || recordings.networked[recordingId];
                return (
                  <TouchableHighlight style={{ width: '100%' }} key={recording.id} onPress={() => this.addTrack(recording)}>
                    <Text style={{ height: 50, width: 400, color: 'white' }}>{recording.name}</Text>
                  </TouchableHighlight>
                );
              })}
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}
