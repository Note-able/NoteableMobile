import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFetchBlob from 'react-native-fetch-blob';
import Realm from 'realm';
import styles from './styles.js';
import Schemas from '../../../realmSchemas';
import { Recording } from '../';

const realm = new Realm(Schemas.RecordingSchema);
const OPTIONS_WIDTH = 175;

export default class Recordings extends Component {
  static propTypes = {
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

  deleteRecording = (recording) => {
    RNFetchBlob.fs.unlink(recording.path);
    realm.write(() => {
      const recordings = realm.objects('Recording').filtered(`id = ${recording.id}`);
      realm.delete(recordings);
    });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.recordings} bounces={false}>
        {this.props.loadingRecordings ? <ActivityIndicator animating={this.props.loadingRecordings} size="large" style={{ marginTop: 20 }} /> : null }
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
            <Recording primaryAction={() => this.props.startPlayer(recording)} name={recording.name} openMoreMenu={() => this.showOptions(recording.id)} primaryDetails={recording.durationDisplay} />
            <View style={[styles.rowOptions, { width: OPTIONS_WIDTH }]}>
              <TouchableHighlight style={{ width: 25, height: 25, margin: 10 }} onPress={() => this.deleteRecording(recording)}>
                <Icon name="delete" size={25} color={'#95989A'} />
              </TouchableHighlight>
              <Icon name="delete" size={25} style={{ width: 25, height: 25, margin: 10 }} color={'#95989A'} />
              <Icon name="send" size={25} style={{ width: 25, height: 25, margin: 10 }} color={'#95989A'} />
            </View>
          </Animated.View>
            ),
          )}
      </ScrollView>
    );
  }
}
