import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../styles';

export default class SystemMessage extends PureComponent {
  static propTypes = {
    message: PropTypes.string.isRequired,
    kind: PropTypes.string.isRequired,
    persistent: PropTypes.bool,
  };

  state = {
    topAnimation: new Animated.Value(0),
    opacityAnimation: new Animated.Value(0),
    message: this.props.message,
    kind: this.props.kind,
  };

  componentDidMount() {
    this.start();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message !== this.state.oldMessage && nextProps.message !== '') {
      this.setState({
        message: nextProps.message,
        kind: nextProps.kind,
        oldMessage: this.state.message,
      });
      if (this.timeout == null) {
        this.start();
      }
    }
  }

  start = () => {
    const top = Animated.timing(this.state.topAnimation, {
      duration: 400,
      easing: Easing.linear,
      toValue: 40,
    });

    const opacity = Animated.timing(this.state.opacityAnimation, {
      duration: 400,
      easing: Easing.lienar,
      toValue: 1,
    });

    Animated.parallel([top, opacity]).start();

    this.setState({
      oldMessage: this.state.message,
    });

    this.timeout = this.props.persistent
      ? null
      : setTimeout(() => {
        this.timeout = null;
        this.close();
      }, 5000);
  };

  close = () => {
    this.setState({ oldMessage: this.state.message, message: '' });
    const top = Animated.timing(this.state.topAnimation, {
      duration: 300,
      easing: Easing.linear,
      toValue: 0,
    }).start();

    const opacity = Animated.timing(this.state.opacityAnimation, {
      duration: 300,
      easing: Easing.linear,
      toValue: 0,
    });

    Animated.parallel([top, opacity]).start();
  };

  render() {
    return (
      <Animated.View style={[styles.messageContainer, { opacity: this.state.opacityAnimation, transform: [{ translateY: this.state.topAnimation }], backgroundColor: this.state.kind === 'error' ? colors.error : colors.success, zIndex: 100 }]}>
        <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center' }} onPress={() => this.close()}>
          <Text style={styles.message}>{this.state.message}</Text>
        </TouchableOpacity>
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
