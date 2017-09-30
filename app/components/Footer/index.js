import React, { Component } from 'react';
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
import { ShortDisplayTime, DisplayTime } from '../../mappers/recordingMapper';

const LAST_PLAYED = '@PLAYER:LAST_PLAYED';
const windowWidth = Dimensions.get('window').width + 30;
const welcomeString = 'Welcome to Noteable';

const mapDispatchToProps = dispatch => ({
  startPlayer: recording => dispatch(startPlayer(recording)),
});

const mapStateToProps = state => ({
  sound: state.PlayerReducer.sound,
  recording: state.PlayerReducer.recording,
  buffering: state.PlayerReducer.buffering,
});

class Footer extends Component {
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
    timing: {
      isTiming: false,
      displayTime: ShortDisplayTime(0),
      currentTime: 0.0,
    },
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
      }, nextProps.recording != null ? () => this.play() : null);
    } else if (stateId != null && stateId === nextId) {
      // we have the same sound
      if (this.state.buffering !== nextProps.buffering) {
        // we finished buffering
        this.setState({
          buffering: nextProps.buffering,
        });

        if (!nextProps.buffering) {
          this.stopTiming();
          this.startTiming();
          this.startAnimations();
        }
      } else if (!this.state.sound || this.state.sound.key !== nextProps.sound.key) {
        // this is the first time in the app and we're playing the same recording as last time the app was open
        // OR we are playing the same sound again but it has a different sound key because we've reloaded it
        this.setState({ sound: nextProps.sound }, () => this.play());
      }
    }
  }

  stopTiming = () => {
    clearInterval(this.interval);
    this.setState({
      timing: {
        ...this.state.timing,
        currentTime: 0,
        isTiming: false,
      },
    });
  }

  pauseTiming = () => {
    clearInterval(this.interval);
    this.setState({
      timing: {
        ...this.state.timing,
        isTiming: false,
      },
    });
  }

  startTiming = () => {
    if (this.state.timing.isTiming) {
      return;
    }

    this.setState({
      timing: {
        ...this.state.timing,
        start: new Date() - 20,
        isTiming: true,
      },
    });

    this.interval = setInterval(() => {
      const currentTime = (new Date() - this.state.timing.start);
      this.setState({
        timing: {
          ...this.state.timing,
          currentTime,
          displayTime: DisplayTime(currentTime),
          isTiming: true,
        },
      });
    }, 50);
  }

  resumeTiming = () => {
    this.setState({
      timing: {
        ...this.state.timing,
        start: new Date() - 20 - this.state.timing.currentTime,
      },
    });

    this.interval = setInterval(() => {
      const currentTime = new Date() - this.state.timing.start;
      this.setState({
        timing: {
          ...this.state.timing,
          currentTime,
          displayTime: DisplayTime(currentTime),
          isTiming: true,
        },
      });
    }, 50);
  }

  startAnimations = () => {
    const duration = this.state.isPaused ? ((this.state.sound.duration * 1000) - this.state.timing.currentTime) :
        this.state.sound.duration * 1000;

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

  play = async () => {
    await this.clear();
    await this.setState({
      isPlaying: true,
      isPaused: 0,
      buffering: this.state.recording.path === '',
      timingBarWidth: new Animated.Value(0),
    });

    if (this.state.recording.path !== '') {
      this.startTiming();
      this.startAnimations();
    }

    this.state.sound.play(this.clear);
  }

  resume = async () => {
    this.resumeTiming();
    this.setState({
      isPlaying: true,
      isPaused: false,
    });
    this.state.sound.play(this.clear);
    this.startAnimations();
  }

  clear = async () => {
    if (this.state.sound != null) {
      this.state.sound.stop();
    }

    if (this.timingAnimation != null) {
      this.timingAnimation.stop();
    }

    this.stopTiming();

    await this.setState({
      isPlaying: false,
      isPaused: false,
      timing: {
        ...this.state.timing,
        currentTime: 0,
        isTiming: false,
      },
    });
  }

  pause = () => {
    this.state.sound.pause();
    this.timingAnimation.stop();
    this.pauseTiming();
    this.setState({
      isPlaying: false,
      isPaused: true,
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
              <Text numberOfLines={1} style={styles.playerDetails}>{`${this.state.timing.displayTime}`}</Text>
              {this.state.isPlaying ?
                <TouchableHighlight onPress={this.pause}>
                  <Icon name="pause" size={24} style={{ width: 24, height: 24 }} color={colors.green} />
                </TouchableHighlight> :
                <TouchableHighlight onPress={this.state.isPaused ? () => this.resume() : () => this.props.startPlayer(this.state.recording)}>
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
