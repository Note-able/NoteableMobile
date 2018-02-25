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

import { startPlayer } from '../../actions/playerActions';

import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles.js';
import { colors } from '../../styles';
import { mapIcon } from '../util.js';
import { ShortDisplayTime } from '../../mappers/recordingMapper';

const LAST_PLAYED = '@PLAYER:LAST_PLAYED';
const windowWidth = Dimensions.get('window').width + 60;
const welcomeString = 'Welcome to Noteable';

const mapDispatchToProps = dispatch => ({
  startPlayer: recording => dispatch(startPlayer(recording)),
});

const mapStateToProps = state => ({
  sound: state.PlayerReducer.sound,
  recording: state.PlayerReducer.recording,
  playerState: state.PlayerReducer.playerState,
  isPlaying: state.PlayerReducer.isPlaying,
});

class Footer extends Component {
  static propTypes = {
    startPlayer: PropTypes.func.isRequired,
    sound: PropTypes.shape({
      pause: PropTypes.func.isRequired,
      play: PropTypes.func.isRequired,
    }),
    recording: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    isPlaying: PropTypes.bool,
  };

  state = {
    timingBarWidth: new Animated.Value(0),
    isPlaying: this.props.isPlaying,
    isPaused: false,
    recording: this.props.recording,
    sound: this.props.sound,
    timing: {
      isTiming: false,
      displayTime: ShortDisplayTime(0),
      currentTime: 0.0,
    },
    playerState: this.props.playerState,
  };

  componentDidMount = async () => {
    const recording = await AsyncStorage.getItem(LAST_PLAYED);
    this.setState({
      recording: recording == null ? null : JSON.parse(recording),
    });
  };

  componentWillReceiveProps = async nextProps => {
    if (this.props.playerState !== nextProps.playerState) {
      await this.setState({
        playerState: !this.state.playerState,
        sound: nextProps.sound,
        duration: nextProps.sound.duration,
        isPlaying: nextProps.isPlaying,
        recording: nextProps.recording,
        isPaused: false,
        timingBarWidth: new Animated.Value(0),
        timing: {
          ...this.state.timing,
          currentTime: 0,
          isTiming: false,
        },
      });

      this.startTiming();
      this.startAnimations();
    } else if (this.state.isPlaying && !nextProps.isPlaying) {
      await this.setState({
        isPlaying: nextProps.isPlaying,
      });

      this.stopTiming();
      this.timingAnimation.stop();
    }
  };

  stopTiming = () => {
    clearInterval(this.interval);
    this.setState({
      timing: {
        ...this.state.timing,
        currentTime: 0,
        isTiming: false,
      },
    });
  };

  pauseTiming = () => {
    clearInterval(this.interval);
    this.setState({
      timing: {
        ...this.state.timing,
        isTiming: false,
      },
    });
  };

  startTiming = () => {
    if (this.state.timing.isTiming) {
      return;
    }

    clearInterval(this.interval);

    this.setState({
      timing: {
        ...this.state.timing,
        start: new Date() - 20,
        isTiming: true,
      },
    });

    this.interval = setInterval(() => {
      const currentTime = new Date() - this.state.timing.start;
      this.setState({
        timing: {
          ...this.state.timing,
          currentTime,
          displayTime: ShortDisplayTime(currentTime),
          isTiming: true,
        },
      });
    }, 50);
  };

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
          displayTime: ShortDisplayTime(currentTime),
          isTiming: true,
        },
      });
    }, 50);
  };

  startAnimations = () => {
    const duration = this.state.isPaused
      ? this.state.duration * 1000 - this.state.timing.currentTime
      : this.state.duration * 1000;

    this.setTimingBarAnimation(duration);

    if (this.state.recording != null) {
      AsyncStorage.setItem(LAST_PLAYED, JSON.stringify(this.state.recording));
    }
  };

  setTimingBarAnimation = duration => {
    this.timingAnimation = Animated.timing(this.state.timingBarWidth, {
      easing: Easing.linear,
      toValue: windowWidth,
      duration,
    });
    this.timingAnimation.start();
  };

  play = async () => {
    this.startAnimations();
    if (this.state.isPaused) {
      this.resumeTiming();
    } else {
      this.startTiming();
    }
    this.state.sound.play(this.clear);
  };

  resume = async () => {
    this.resumeTiming();
    this.state.sound.play(this.clear);
    this.startAnimations();
    await this.setState({
      isPlaying: true,
      isPaused: false,
    });
  };

  clear = async () => {
    await this.setState({
      isPlaying: false,
    });

    this.stopTiming();
    this.timingAnimation.stop();
  };

  pause = () => {
    this.state.sound.pause();
    this.timingAnimation.stop();
    this.pauseTiming();
    this.setState({
      isPlaying: false,
      isPaused: true,
    });
  };

  render() {
    return (
      <View style={styles.footerContainer}>
        {/* Player Component */}
        {this.state.recording != null ? (
          <View style={[styles.playerContainer, { height: 40 }]}>
            <Animated.View style={[styles.timingBar, { width: this.state.timingBarWidth }]} />
            <View style={styles.player}>
              <Text numberOfLines={1} style={styles.playerText}>
                {this.state.recording.name}
              </Text>
              <Text numberOfLines={1} style={styles.playerDetails}>{`${
                this.state.timing.displayTime
              }`}</Text>
              {this.state.isPlaying ? (
                <TouchableHighlight onPress={this.pause}>
                  <Icon
                    name="pause"
                    size={24}
                    style={{ width: 24, height: 24 }}
                    color={colors.green}
                  />
                </TouchableHighlight>
              ) : (
                <TouchableHighlight
                  onPress={
                    this.state.isPaused
                      ? () => this.resume()
                      : () => this.props.startPlayer(this.state.recording)
                  }
                >
                  <Icon
                    name="play-arrow"
                    size={24}
                    style={{ width: 24, height: 24 }}
                    color={colors.green}
                  />
                </TouchableHighlight>
              )}
            </View>
          </View>
        ) : null}
        {/* Tabs Component */}
        <View style={styles.tabsContainer}>
          {this.props.navigationState.routes.map((route, index) => (
            <TouchableHighlight
              style={styles.navButton}
              onPress={() => this.props.navigation.navigate(route.key)}
              key={route.key}
            >
              <View style={styles.button}>
                <Icon
                  name={mapIcon[route.key]}
                  size={32}
                  style={{ width: 32, height: 32 }}
                  color={index === this.props.navigationState.index ? colors.green : 'white'}
                />
              </View>
            </TouchableHighlight>
          ))}
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
