import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
} from 'react-native';
import { colors } from '../../../styles';

export default class SystemMessage extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    kind: PropTypes.string.isRequired,
  };

  state = {
    topAnimation: new Animated.Value(0),
    opacityAnimation: new Animated.Value(0),
    message: this.props.message,
    kind: this.props.kind,
  }

  componentDidMount() {
    const top = Animated.timing(
      this.state.topAnimation, {
        duration: 400,
        easing: Easing.linear,
        toValue: 40,
      },
    );

    const opacity = Animated.timing(
      this.state.opacityAnimation, {
        duration: 400,
        easing: Easing.lienar,
        toValue: 1,
      },
    );

    Animated.parallel([top, opacity]).start();

    setTimeout(() => {
      this.close();
    }, 5000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message !== this.state.oldMessage && nextProps.message !== '') {
      this.setState({ message: nextProps.message, kind: nextProps.kind });
    }
  }

  close() {
    this.setState({ oldMessage: this.state.message, message: '' });
    const top = Animated.timing(
      this.state.topAnimation, {
        duration: 300,
        easing: Easing.linear,
        toValue: 0,
      },
    ).start();

    const opacity = Animated.timing(
      this.state.opacityAnimation, {
        duration: 300,
        easing: Easing.linear,
        toValue: 0,
      },
    );

    Animated.parallel([top, opacity]).start();
  }

  render() {
    return (
      <Animated.View style={[styles.messageContainer, { opacity: this.state.opacityAnimation, transform: [{ translateY: this.state.topAnimation }], backgroundColor: this.props.kind === 'error' ? colors.error : colors.success }]}>
        <Text style={styles.message}>{this.props.message}</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: 100,
  },
  message: {
    color: colors.shade200,
    textAlign: 'center',
  },
});
