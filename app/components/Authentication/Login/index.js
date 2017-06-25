import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../../styles';
import { InputField } from '../../Shared';

export default class Login extends Component {
  static propTypes = {
    submitLogin: PropTypes.func.isRequired,
    switchToRegister: PropTypes.func.isRequired,
  };

  state = {
    password: '',
    email: '',
  };

  render() {
    return (
      <View style={styles.container}>
        <InputField
          name="Email"
          inputContainerStyles={styles.input}
          inputProps={{
            autoCorrect: false,
            keyboardType: 'email-address',
            maxLength: 100,
            onChangeText: text => this.setState({ email: text }),
            onEndEditing: () => this._password.focusInput(),
            returnKeyType: 'next',
            style: styles.inputTextField,
            value: this.state.email,
          }}
        />
        <InputField
          name="Password"
          ref={(ref) => { this._password = ref; }}
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

        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={this.props.switchToRegister}>
            <Text style={{ color: colors.blue, paddingTop: 8 }}>Create a free account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.submitLogin(this.state.email, this.state.password)}>
            <View style={styles.submitButton}>
              <Text style={{ color: colors.shade20 }}>Submit</Text>
            </View>
          </TouchableOpacity>
        </View>
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
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 2,
    height: 32,
    justifyContent: 'center',
    width: 75,
  },
});
