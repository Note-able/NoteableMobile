import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { colors } from '../../../styles';

export default class InputField extends Component {
  static props = {
    inputContainerStyles: PropTypes.shape({}),
  }

  state = {
    fieldAnimation: new Animated.Value(0),
  }

  focus = (value) => {
    Animated.spring(
      this.state.fieldAnimation, {
        duration: 30,
        easing: Easing.quad,
        toValue: value,
      },
    ).start();
  }

  onBlur = () => {
    if (this._input._getText() === '') {
      this.focus(0);
    }
  }

  focusInput = () => {
    this._input.focus();
  }

  render() {
    return (
      <View style={this.props.inputContainerStyles}>
        <Animated.Text
          style={[
            styles.floater,
            {
              transform: [{
                translateY: this.state.fieldAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [8, -20],
                }),
              }],
              fontSize: this.state.fieldAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 13],
              }),
            },
          ]}
        >{this.props.name}</Animated.Text>
        <TextInput
          ref={(ref) => { this._input = ref; }}
          onFocus={() => this.focus(1)}
          onBlur={this.onBlur}
          {...this.props.inputProps}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  floater: {
    backgroundColor: 'transparent',
    color: colors.shade40,
    fontSize: 16,
    left: 8,
    position: 'absolute',
    transform: [{
      translateY: 8,
    }],
  },
});
