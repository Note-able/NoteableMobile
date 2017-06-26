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
import Schemas from '../../../realmSchemas';
import { Recording } from '../';

const realm = Schemas.RecordingSchema;
const OPTIONS_WIDTH = 175;

export default class Recordings extends Component {
  static propTypes = {
    deleteRecording: PropTypes.func.isRequired,
    editRecording: PropTypes.func.isRequired,
    loadingRecordings: PropTypes.bool,
    recordings: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      description: PropTypes.string,
      path: PropTypes.string.isRequired,
    })),
    startPlayer: PropTypes.func.isRequired,
  };

  state = {
    showOptions: null,
    recordingsOpacity: new Animated.Value(0),
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.recordings.length === 0 && nextProps.recordings.length !== 0) {
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

    if (this.state.showOptions && this.state[this.state.showOptions.id]._value !== 0) {
      oldOptions = this.state.showOptions;
    }

    this.setState({
      showOptions: this.props.recordings.find(x => x.id === recordingId),
    });

    if (oldOptions == null || oldOptions.id !== recordingId) {
      animations.push(Animated.spring(
        this.state[recordingId], {
          easing: Easing.quad,
          toValue: 1,
          duration: 100,
        }));
    }

    if (oldOptions != null) {
      if (oldOptions.id === recordingId) {
        this.setState({
          showOptions: null,
        });
      }

      animations.push(Animated.spring(
        this.state[oldOptions.id], {
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
          {this.props.recordings.map(recording => (
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
                  <Icon name="delete" size={25} color={'#95989A'} />
                </TouchableHighlight>
                <TouchableHighlight style={{ width: 25, height: 25, margin: 10 }} onPress={() => this.props.editRecording(recording)}>
                  <Icon name="create" size={25} color={'#95989A'} />
                </TouchableHighlight>
                <TouchableHighlight style={{ width: 25, height: 25, margin: 10 }} onPress={() => {}}>
                  <Icon name="send" size={25} color={'#95989A'} />
                </TouchableHighlight>
              </View>
            </Animated.View>
              ),
            )}
        </Animated.View>
      </ScrollView>
    );
  }
}
