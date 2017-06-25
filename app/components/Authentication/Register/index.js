import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '../../../styles';
import { InputField } from '../../Shared';

export default class Register extends Component {
  static propTypes = {
    submit: PropTypes.func.isRequired,
  };

  state = {
    password: '',
    username: '',
  };

  render() {
    return (
      <View style={styles.container}>
        <InputField
          name="Name"
          inputContainerStyles={styles.input}
          inputProps={{
            autoCorrect: false,
            maxLength: 100,
            onChangeText: text => this.setState({ username: text }),
            returnKeyType: 'next',
            style: styles.inputTextField,
            value: this.state.username,
          }}
        />
        <InputField
          name="Email"
          inputContainerStyles={styles.input}
          inputProps={{
            autoCorrect: false,
            keyboardType: 'email-address',
            maxLength: 100,
            onChangeText: text => this.setState({ username: text }),
            returnKeyType: 'next',
            style: styles.inputTextField,
            value: this.state.username,
          }}
        />
        <InputField
          name="Password"
          inputContainerStyles={styles.input}
          inputProps={{
            autoCorrect: false,
            maxLength: 100,
            onChangeText: text => this.setState({ password: text }),
            returnKeyType: 'next',
            secureTextEntry: true,
            style: styles.inputTextField,
            value: this.state.password,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.shade20,
    height: 36,
    marginTop: 28,
    width: 250,
  },
  inputTextField: {
    color: colors.shade90,
    fontSize: 16,
    height: 36,
    paddingLeft: 8,
  },
});
