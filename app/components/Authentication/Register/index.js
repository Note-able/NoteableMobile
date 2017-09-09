import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FBSDK from 'react-native-fbsdk';
import { colors } from '../../../styles';
import { InputField } from '../../Shared';
import { logErrorToCrashlytics } from '../../../util';

const {
  AccessToken,
  LoginManager,
} = FBSDK;

export default class Register extends Component {
  static propTypes = {
    submitRegister: PropTypes.func.isRequired,
    switchToLogin: PropTypes.func.isRequired,
  };

  state = {
    password: '',
    email: '',
    lastName: '',
    firstName: '',
  };

  facebookLogin = () => {
    LoginManager.logInWithReadPermissions().then(
      (result) => {
        if (!result.isCancelled) {
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              this.props.loginFacebook(data.accessToken.toString());
            },
          );
        }
      }, logErrorToCrashlytics,
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <InputField
          name="First Name"
          inputContainerStyles={styles.input}
          inputProps={{
            autoCorrect: false,
            maxLength: 100,
            onChangeText: text => this.setState({ firstName: text }),
            onEndEditing: () => this._lastName.focusInput(),
            returnKeyType: 'next',
            style: styles.inputTextField,
            value: this.state.firstName,
          }}
        />
        <InputField
          ref={(ref) => { this._lastName = ref; }}
          name="Last Name"
          inputContainerStyles={styles.input}
          inputProps={{
            autoCorrect: false,
            maxLength: 100,
            onChangeText: text => this.setState({ lastName: text }),
            returnKeyType: 'next',
            style: styles.inputTextField,
            value: this.state.lastName,
          }}
        />
        <InputField
          ref={(ref) => { this._email = ref; }}
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
          ref={(ref) => { this._password = ref; }}
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
        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={this.props.switchToLogin}>
            <Text style={{ color: colors.blue, paddingTop: 8 }}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.submitRegister({ firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, password: this.state.password })}>
            <View style={styles.submitButton}>
              <Text style={{ color: colors.shade20 }}>Register</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={this.facebookLogin} style={{ alignItems: 'center' }}>
          <View style={styles.facebook}>
            <Text style={{ color: colors.facebook }}>Use Facebook</Text>
          </View>
        </TouchableOpacity>
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
  facebook: {
    alignItems: 'center',
    borderColor: colors.facebook,
    borderWidth: 1,
    borderRadius: 4,
    height: 32,
    justifyContent: 'center',
    marginTop: 20,
    width: 150,
  },
});
