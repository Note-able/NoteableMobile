import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFetchBlob from 'react-native-fetch-blob';
import Realm from 'realm';
import { Modal } from '../../Shared';
import styles from './styles.js';
import Schemas from '../../../realmSchemas';

const realm = new Realm(Schemas.RecordingSchema);
const OPTIONS_WIDTH = 175;

export default class RecentRecordings extends Component {
  static propTypes = {
    recentRecordings: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      description: PropTypes.string,
      path: PropTypes.string.isRequired,
    })),
  };

  state = {
    showOptions: null,
  }

  playSong = (recordingId) => {
    const audio = new Sound(this.props.recentRecordings.filter(x => x.id === recordingId)[0], '', (err) => {
      if (err != null) {
        console.warn(err);
      }

      console.log(audio);
    });
  }

  createAnimations = (recordingId) => {
    const animations = [];
    let oldOptions = null;

    if (this.state.showOptions && this.state[this.state.showOptions.id]._value !== 0) {
      oldOptions = this.state.showOptions;
    }

    this.setState({
      showOptions: this.props.recentRecordings.find(x => x.id === recordingId),
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

  deleteModal = (id) => {
    this.props.renderModal(
      'Confirm',
      'Cancel',
      () => this.deleteRecording(this.props.recentRecordings.find(x => x.id === id)),
      () => this.setState({ delete: null }),
      `Delete ${this.props.recentRecordings.find(x => x.id === id).name}`,
      (<Text style={{ color: '#95989A', textAlign: 'center' }}>Are you sure you want to delete this?</Text>),
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Recent</Text>
          <Text style={styles.navigateRecordings}>{'Recordings >'}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.recentRecordings} bounces={false}>
          {this.props.recentRecordings.map(recording => (
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
              <View style={styles.rowContent}>
                <TouchableHighlight onPress={() => {}}>
                  <Text style={[styles.rowTitle, styles.name]}>{recording.name}</Text>
                </TouchableHighlight>
                <Text style={styles.rowTitle}>{recording.durationDisplay}</Text>
                <TouchableHighlight onPress={() => this.showOptions(recording.id)}>
                  <Icon name="more-horiz" size={40} style={{ width: 40, height: 40, margin: 10 }} color={'#95989A'} />
                </TouchableHighlight>
              </View>

              <View style={[styles.rowOptions, { width: OPTIONS_WIDTH }]}>
                <TouchableHighlight style={{ width: 25, height: 25, margin: 10 }} onPress={() => this.deleteModal(recording.id)}>
                  <Icon name="delete" size={25} color={'#95989A'} />
                </TouchableHighlight>
                <Icon name="delete" size={25} style={{ width: 25, height: 25, margin: 10 }} color={'#95989A'} />
                <Icon name="send" size={25} style={{ width: 25, height: 25, margin: 10 }} color={'#95989A'} />
              </View>
            </Animated.View>
            ),
          )}
        </ScrollView>
      </View>
    );
  }
}
