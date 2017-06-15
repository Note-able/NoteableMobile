import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Animated,
  Dimensions,
  Easing,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import {
  togglePlayer,
} from '../../../actions/playerActions';

import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles.js';
import { colors } from '../../../styles';
import { mapIcon } from '../util.js';

const mapDispatchToProps = dispatch => ({
  togglePlayer: play => dispatch(togglePlayer(play)),
});

const mapStateToProps = state => ({
  player: state.Player,
});

class Footer extends Component {
  state = {
    player: this.props.player,
    playerHeight: new Animated.Value(0),
    timingBarWidth: new Animated.Value(0),
    isPlaying: false,
    showPlayer: false,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.navigationState.index === nextProps.navigationState.index && ((this.state.player.sound == null && nextProps.player.sound != null) || nextProps.player.recording != null)) {
      this.setState({
        player: nextProps.player,
        isPlaying: true,
        showPlayer: true,
      }, () => this.animatePlayer(40));
    }
  }

  resetPlayer = () => {
    this.setState({
      timingBarWidth: new Animated.Value(0),
      playerHeight: new Animated.Value(0),
      isPlaying: false,
    });

    this.hideTimeout = setTimeout(() => {
      this.setState({
        showPlayer: false,
      });

      Animated.timing(
        this.state.playerHeight, {
          easing: Easing.linear,
          toValue: 0,
          duration: 50,
        }).start();
    }, 30000);
  }

  animatePlayer = (height) => {
    if (this.hideTimeout == null) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    this.setState({
      showPlayer: true,
    });

    Animated.timing(
      this.state.playerHeight, {
        easing: Easing.linear,
        toValue: height,
        duration: 50,
      }).start();

    this.state.player.sound.play(this.resetPlayer);

    Animated.timing(
      this.state.timingBarWidth, {
        easing: Easing.linear,
        toValue: Dimensions.get('window').width,
        duration: this.state.player.recording.duration * 1000,
      },
    ).start();
  }

  render() {
    return (
      <View style={styles.footerContainer}>

        {
          /**
           * Player Component
           */
        }
        {this.state.showPlayer ? <Animated.View style={[styles.timingBar, { width: this.state.timingBarWidth }]} /> : null}
        <Animated.View style={[styles.playerContainer, { height: this.state.playerHeight }]}>
          {this.state.player.sound != null ?
            <View style={styles.player}>
              <Text style={styles.playerText}>{this.state.player.recording.name}</Text>
              <Text style={styles.playerDetails}>{this.state.player.recording.name}</Text>
              {this.state.isPlaying ?
                <TouchableHighlight >
                  <Icon name="pause" size={24} style={{ width: 24, height: 24 }} color={colors.green} />
                </TouchableHighlight> :
                <TouchableHighlight onPress={() => this.animatePlayer(40)}>
                  <Icon name="play-arrow" size={24} style={{ width: 24, height: 24 }} color={colors.green} />
                </TouchableHighlight> }
            </View>
            : null}
        </Animated.View>

        {
          /**
           * Tabs Component
           */
        }
        <View style={styles.tabsContainer}>
          {this.props.navigationState.routes.map((route, index) => (
            <TouchableHighlight style={styles.navButton} onPress={() => this.props.navigation.navigate(route.key)}>
              <View style={styles.button} key={route.key}>
                <Icon name={mapIcon[route.key]} size={24} style={{ width: 24, height: 24 }} color={index === this.props.navigationState.index ? colors.green : 'white'} />
                <Text style={styles.buttonText}>{route.key}</Text>
              </View>
            </TouchableHighlight>
          ))}
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
