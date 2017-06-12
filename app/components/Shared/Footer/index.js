import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Animated,
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
  };

  componentWillReceiveProps(nextProps) {
    if ((this.state.player.sound == null && nextProps.player.sound != null) || this.state.player.recording.path !== nextProps.player.recording.path) {
      this.setState({
        player: nextProps.player,
      });

      this.animatePlayer(36);
    }
  }

  animatePlayer = (height) => {
    Animated.timing(
      this.state.playerHeight, {
        easing: Easing.linear,
        toValue: height,
        duration: 50,
      }).start();
  }

  render() {
    return (
      <View style={styles.footerContainer}>
        {
          /**
           * Player Component
           */
        }
        <Animated.View style={[styles.playerContainer, { height: this.state.playerHeight }]}>
          {this.state.player.sound != null ?
            <View style={styles.player}>
              <Text style={styles.playerText}>{this.state.player.recording.name}</Text>
              <Text style={styles.playerText}>{this.state.player.recording.name}</Text>
            </View>
            : null}
        </Animated.View>

        {
          /**
           * Tabs Component
           */
        }
        <View style={styles.tabsContainer}>
          <TouchableHighlight style={styles.navButton} onPress={this.props.openNav}>
            <View style={styles.button}>
              <Icon name="mic" size={24} style={{ width: 24, height: 24 }} color={'white'} />
              <Text style={styles.buttonText}>Settings</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.navButton} onPress={this.props.openNav}>
            <View style={styles.button}>
              <Icon name="album" size={24} style={{ width: 24, height: 24 }} color={'white'} />
              <Text style={styles.buttonText}>Recordings</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.navButton} onPress={this.props.openNav}>
            <View style={styles.button}>
              <Icon name="mic" size={24} style={{ width: 24, height: 24 }} color={'white'} />
              <Text style={styles.buttonText}>Record</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
