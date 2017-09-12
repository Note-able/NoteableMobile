import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  FlatList,
  TouchableHighlight,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import styles from './styles.js';
import { Recording } from '../';
import { colors } from '../../../styles';

const OPTIONS_WIDTH = 175;
const ITEM_HEIGHT = 48;

export default class Recordings extends Component {
  static propTypes = {
    deleteRecording: PropTypes.func.isRequired,
    downloadRecording: PropTypes.func.isRequired,
    editRecording: PropTypes.func.isRequired,
    loadingRecordings: PropTypes.bool,
    uploadRecording: PropTypes.func.isRequired,
    syncDownRecordings: PropTypes.func.isRequired,
    removeRecording: PropTypes.func.isRequired,
    recordings: PropTypes.shape({}),
    startPlayer: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({}),
  };

  state = {
    showOptions: null,
    recordingsOpacity: new Animated.Value(0),
    recordings: this.props.recordings,
  }

  componentDidMount() {
    if (this.props.recordings.length !== 0) {
      Animated.timing(
        this.state.recordingsOpacity, {
          easing: Easing.cubic,
          toValue: 1,
          duration: 200,
        }).start();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      recordings: nextProps.recordings,
    });

    if (this.props.recordings != null && this.props.recordings.order.length === 0 && nextProps.recordings.order.length !== 0) {
      Animated.timing(
        this.state.recordingsOpacity, {
          easing: Easing.cubic,
          toValue: 1,
          duration: 200,
        }).start();
    }
  }

  createAnimations = (recordingId) => {
    const animations = [];
    let oldOptions = null;

    if (this.state.showOptions && this.state[this.state.showOptions]._value !== 0) {
      oldOptions = this.state.showOptions;
    }

    this.setState({
      showOptions: this.state.recordings.order.find(x => x === recordingId),
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

  startPlayer = (recording) => {
    this.props.startPlayer(recording);
    this.setState({
      activeRecording: recording.id,
    });
  }

  render() {
    return (
      <FlatList
        contentContainerStyle={styles.recordings}
        bounces
        data={this.state.recordings.order}
        getItemLayout={(data, index) => (
          { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
        )}
        initialNumToRender={12}
        onRefresh={this.props.syncDownRecordings}
        refreshing={false}
        removeClippedSubviews={false}
        renderItem={({ item }) => {
          const recording = this.state.recordings.local[item] || this.state.recordings.networked[item];
          return (
            <View key={recording.id}>
              <View style={[styles.rowOptions, { width: OPTIONS_WIDTH, position: 'absolute', right: 0 }]}>
                <TouchableHighlight style={{ width: 25, height: 25, margin: 10 }} onPress={() => this.props.deleteRecording(recording)}>
                  <Icon name="delete" size={25} color={colors.shade90} />
                </TouchableHighlight>
                <TouchableHighlight style={{ width: 25, height: 25, margin: 10 }} onPress={() => this.props.editRecording(recording)}>
                  <Icon name="create" size={25} color={colors.shade90} />
                </TouchableHighlight>
                {recording.path !== '' && recording.isSynced ?
                  <TouchableHighlight style={{ width: 25, height: 25, margin: 10 }} onPress={() => this.props.removeRecording(recording)}>
                    <Icon name="close" size={25} color={colors.shade90} />
                  </TouchableHighlight> :
                  <TouchableHighlight style={{ width: 25, height: 25, margin: 10 }} onPress={() => (recording.path === '' ? this.props.downloadRecording(recording) : this.props.uploadRecording(recording, this.props.currentUser))}>
                    <Icon name={recording.path === '' ? 'file-download' : 'cloud-upload'} size={25} color={this.props.currentUser == null ? colors.shade40 : colors.shade90} />
                  </TouchableHighlight>
                }
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
                  primaryAction={() => this.startPlayer(recording)}
                  name={recording.name}
                  isOpen={this.state.showOptions != null && this.state.showOptions.id === recording.id}
                  isPlaying={this.state.activeRecording === recording.id}
                  openMoreMenu={() => this.showOptions(recording.id)}
                  secondaryDetails={recording.durationDisplay}
                  primaryDetails={moment(recording.dateCreated).format('MM/DD/YYYY')}
                />
              </Animated.View>
            </View>
          );
        }}
      />
    );
  }
}
