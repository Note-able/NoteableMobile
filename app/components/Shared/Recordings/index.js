import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  TouchableHighlight,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import styles from './styles.js';
import { Recording } from '../';
import { colors } from '../../../styles';

const OPTIONS_WIDTH = 175;

export default class Recordings extends Component {
  static propTypes = {
    deleteRecording: PropTypes.func.isRequired,
    editRecording: PropTypes.func.isRequired,
    loadingRecordings: PropTypes.bool,
    uploadRecording: PropTypes.func.isRequired,
    recordings: PropTypes.shape({}),
    startPlayer: PropTypes.func.isRequired,
    currentUser: PropTypes.shape({}),
  };

  state = {
    showOptions: null,
    recordingsOpacity: new Animated.Value(0),
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

  startPlayer = (recording) => {
    this.props.startPlayer(recording);
    this.setState({
      activeRecording: recording.id,
    });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.recordings} bounces>
        {this.props.loadingRecordings ? <ActivityIndicator animating={this.props.loadingRecordings} size="large" style={{ marginTop: 20 }} /> : null }
        <Animated.View
          style={{ opacity: this.state.recordingsOpacity }}
        >
          {this.props.recordings.order.map((rec) => {
            const recording = this.props.recordings.local[rec] || this.props.recordings.networked[rec];
            return (
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
                key={recording.id}
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
                <View style={[styles.rowOptions, { width: OPTIONS_WIDTH }]}>
                  <TouchableHighlight style={{ width: 25, height: 25, margin: 10 }} onPress={() => this.props.deleteRecording(recording)}>
                    <Icon name="delete" size={25} color={colors.shade90} />
                  </TouchableHighlight>
                  <TouchableHighlight style={{ width: 25, height: 25, margin: 10 }} onPress={() => this.props.editRecording(recording)}>
                    <Icon name="create" size={25} color={colors.shade90} />
                  </TouchableHighlight>
                  <TouchableHighlight style={{ width: 25, height: 25, margin: 10 }} onPress={() => this.props.uploadRecording(recording, this.props.currentUser)}>
                    <Icon name={recording.path === '' ? 'file-download' : 'cloud-upload'} size={25} color={this.props.currentUser == null ? colors.shade40 : (recording.isSynced && recording.path !== '' ? colors.green : colors.shade90)} />
                  </TouchableHighlight>
                </View>
              </Animated.View>
            );
          },
        )}
        </Animated.View>
      </ScrollView>
    );
  }
}
