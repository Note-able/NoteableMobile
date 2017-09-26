import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Animated,
  AsyncStorage,
  Dimensions,
  Easing,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import {
  startPlayer,
} from '../../actions/playerActions';

import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles.js';
import { colors } from '../../styles';
import { mapIcon } from '../util.js';

const LAST_PLAYED = '@PLAYER:LAST_PLAYED';
const windowWidth = Dimensions.get('window').width + 20;
const welcomeString = 'Welcome to Noteable';

const mapDispatchToProps = dispatch => ({
  startPlayer: recording => dispatch(startPlayer(recording)),
});

const mapStateToProps = state => ({
  sound: state.PlayerReducer.sound,
  recording: state.PlayerReducer.recording,
  buffering: state.PlayerReducer.buffering,
});

class Footer extends PureComponent {
  state = {
    player: this.props.player,
    playerHeight: new Animated.Value(0),
    timingBarWidth: new Animated.Value(0),
    isPlaying: false,
    isPaused: 0,
    showPlayer: false,
    recording: this.props.recording,
    sound: this.props.sound,
    buffering: false,
  };

  componentDidMount = async () => {
    const recording = await AsyncStorage.getItem(LAST_PLAYED);
    this.setState({
      recording: recording == null ? null : JSON.parse(recording),
    });
  }

  componentWillReceiveProps(nextProps) {
    const { id } = this.state.recording || {};
    const stateId = id;
    const nextId = (nextProps.recording || {}).id;

    if ((stateId == null && nextId != null) || (nextId !== stateId) || (!this.state.buffering && nextProps.buffering)) {
      // we have a new sound
      this.setState({
        sound: nextProps.sound || this.state.sound,
        recording: nextProps.recording || this.state.recording,
        buffering: nextProps.buffering,
      }, nextProps.recording != null ? () => this.onPlay() : null);
    } else if (stateId != null && stateId === nextId) {
      // we have the same sound
      if (this.state.buffering !== nextProps.buffering) {
        // we finished buffering
        this.setState({
          buffering: nextProps.buffering,
        });

        if (!nextProps.buffering) {
          this.startAnimations();
        } else {
          // we are playing the same sound again
          this.props.startPlayer(this.state.recording);
        }
      }
    }
  }

  startAnimations = () => {
    const duration = this.state.isPaused ? ((this.state.recording.duration || this.state.sound.duration) * 1000) - (this.state.isPaused * 1000) :
      (this.state.recording.duration || this.state.sound.duration) * 1000;
    this.setTimingBarAnimation(duration);

    if (this.state.recording != null) {
      AsyncStorage.setItem(LAST_PLAYED, JSON.stringify(this.state.recording));
    }
  }

  setTimingBarAnimation = (duration) => {
    this.timingAnimation = Animated.timing(
      this.state.timingBarWidth, {
        easing: Easing.linear,
        toValue: windowWidth,
        duration,
      },
    );
    this.timingAnimation.start();
  }

  onPlay = async () => {
    if (this.state.isPaused) {
      this.state.sound.resume();
    } else {
      await this.clearPlayer();
      this.setState({
        isPlaying: true,
        isPaused: 0,
      });
      this.state.sound.play(this.clearPlayer);
    }
  }

  clearPlayer = async () => {
    if (this.state.sound != null) {
      this.state.sound.stop();
    }

    if (this.timingAnimation != null) {
      this.timingAnimation.stop();
    }

    await this.setState({
      timingBarWidth: new Animated.Value(0),
      isPlaying: false,
      isPaused: false,
    });
  }

  onPause = () => {
    this.state.sound.pause();
    this.timingAnimation.stop();
    this.state.sound.getCurrentTime((seconds) => {
      this.setState({
        isPlaying: false,
        isPaused: seconds,
      });
    });
  }

  render() {
    return (
      <View style={styles.footerContainer}>
        {/* Player Component */}
        {this.state.recording != null ?
          <View style={[styles.playerContainer, { height: 40 }]}>
            <Animated.View style={[styles.timingBar, { width: this.state.timingBarWidth }]} />
            <View style={styles.player}>
              <Text numberOfLines={1} style={styles.playerText}>{this.state.recording.name}</Text>
              <Text numberOfLines={1} style={styles.playerDetails}>{this.state.recording.name}</Text>
              {this.state.isPlaying ?
                <TouchableHighlight onPress={this.onPause}>
                  <Icon name="pause" size={24} style={{ width: 24, height: 24 }} color={colors.green} />
                </TouchableHighlight> :
                <TouchableHighlight onPress={this.onPlay}>
                  <Icon name="play-arrow" size={24} style={{ width: 24, height: 24 }} color={colors.green} />
                </TouchableHighlight> }
            </View>
          </View>
          : null}
        {/* Tabs Component */}
        <View style={styles.tabsContainer}>
          {this.props.navigationState.routes.map((route, index) => (
            <TouchableHighlight style={styles.navButton} onPress={() => this.props.navigation.navigate(route.key)} key={route.key}>
              <View style={styles.button}>
                <Icon name={mapIcon[route.key]} size={32} style={{ width: 32, height: 32 }} color={index === this.props.navigationState.index ? colors.green : 'white'} />
              </View>
            </TouchableHighlight>
          ))}
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
