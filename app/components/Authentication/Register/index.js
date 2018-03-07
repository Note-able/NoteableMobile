import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FBSDK from 'react-native-fbsdk';
import { colors } from '../../../styles';
import { InputField } from '../../';
import { emailRegex } from '../../../constants';
import { logErrorToCrashlytics } from '../../../util';

const { AccessToken, LoginManager } = FBSDK;

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
    emailError: '',
    passwordError: '',
    firstNameError: '',
    lastNameError: '',
  };

  facebookLogin = () => {
    LoginManager.logInWithReadPermissions().then((result) => {
      if (!result.isCancelled) {
        AccessToken.getCurrentAccessToken().then((data) => {
          this.props.loginFacebook(data.accessToken.toString());
        });
      }
    }, logErrorToCrashlytics);
  };

  finishEmail = () => {
    this._password.focusInput();
    if (this.state.email.trim().length === 0 || this.state.email.match(emailRegex) == null) {
      this.setState({ emailError: 'Please enter a valid email address' });
    } else {
      this.setState({ emailError: '' });
    }
  };

  finishPassword = () => {
    if (this.state.password.trim().length < 7) {
      this.setState({ passwordError: 'Please enter a 7 character password' });
    } else if (this.state.password === this.state.email) {
      this.setState({ passwordError: 'Your password cannot be your email' });
    } else {
      this.setState({ passwordError: '' });
    }
  };

  finishFirstName = () => {
    this._lastName.focusInput();
    if (this.state.firstName.trim().length === 0) {
      this.setState({ firstNameError: 'Please enter a first name' });
    } else {
      this.setState({ firstNameError: '' });
    }
  };

  finishLastName = () => {
    if (this.state.lastName.trim().length === 0) {
      this.setState({ lastNameError: 'Please enter a last name' });
    } else {
      this.setState({ lastNameError: '' });
    }
  };

  register = () => {
    if (
      this.state.email === '' ||
      this.state.password === '' ||
      this.state.lastName === '' ||
      this.state.firstName === '' ||
      this.state.emailError ||
      this.state.passwordError
    ) {
      this.finishEmail();
      this.finishPassword();
      this.finishLastName();
      this.finishFirstName();
      return;
    }

    this.props.submitRegister({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
    });
  };

  render() {
    return (
      <View style={{ marginTop: this.state.firstNameError ? 6 : 12, paddingTop: 12 }}>
        {this.state.firstNameError !== '' && (
          <Text style={styles.errorText}>{this.state.firstNameError}</Text>
        )}
        <InputField
          name="First Name"
          inputContainerStyles={[styles.input, { marginBottom: 12 }]}
          inputProps={{
            autoCorrect: false,
            maxLength: 100,
            onChangeText: text => this.setState({ firstName: text }),
            onEndEditing: this.finishFirstName,
            returnKeyType: 'next',
            style: styles.inputTextField,
            value: this.state.firstName,
          }}
        />
        {this.state.lastNameError !== '' && (
          <Text style={styles.errorText}>{this.state.lastNameError}</Text>
        )}
        <InputField
          ref={(ref) => {
            this._lastName = ref;
          }}
          name="Name"
          inputContainerStyles={[styles.input, { marginBottom: 12 }]}
          inputProps={{
            autoCorrect: false,
            maxLength: 100,
            onChangeText: text => this.setState({ lastName: text }),
            onEndEditing: this.finishLastName,
            returnKeyType: 'next',
            style: styles.inputTextField,
            value: this.state.lastName,
          }}
        />
        {this.state.emailError !== '' && (
          <Text style={styles.errorText}>{this.state.emailError}</Text>
        )}
        <InputField
          ref={(ref) => {
            this._email = ref;
          }}
          name="Email"
          inputContainerStyles={[styles.input, { marginBottom: 12 }]}
          inputProps={{
            autoCorrect: false,
            keyboardType: 'email-address',
            maxLength: 100,
            onChangeText: text => this.setState({ email: text }),
            onEndEditing: this.finishEmail,
            returnKeyType: 'next',
            style: styles.inputTextField,
            value: this.state.email,
          }}
        />
        {this.state.passwordError !== '' && (
          <Text style={styles.errorText}>{this.state.passwordError}</Text>
        )}
        <InputField
          ref={(ref) => {
            this._password = ref;
          }}
          name="Password"
          inputContainerStyles={styles.input}
          inputProps={{
            autoCorrect: false,
            maxLength: 100,
            onChangeText: text => this.setState({ password: text }),
            onEndEditing: this.finishPassword,
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
          <TouchableOpacity onPress={this.register}>
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
  errorText: {
    marginLeft: 8,
    color: colors.error,
    backgroundColor: 'transparent',
  },
  input: {
    backgroundColor: colors.shade20,
    height: 36,
    marginTop: 20,
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
