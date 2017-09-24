import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { colors, colorRGBA } from '../../styles';
import { Login, Register } from '../../components/Authentication';

import {
  SystemMessage,
} from '../../components';

import {
  getUser,
  loginFacebook,
  signInLocal,
  registerUser,
} from '../../actions/accountActions';

const mapStateToProps = state => ({
  users: state.AccountReducer,
  system: state.SystemReducer,
});

const mapDispatchToProps = dispatch => ({
  getCurrentUser: (user) => { dispatch(getUser(user)); },
  signInLocal: (email, password) => { dispatch(signInLocal(email, password)); },
  registerUser: (request) => { dispatch(registerUser(request)); },
  loginFacebook: (authToken) => { dispatch(loginFacebook(authToken)); },
});

class Authentication extends Component {
  static propTypes = {
    users: PropTypes.shape({}),
    loginFacebook: PropTypes.func.isRequired,
    signInLocal: PropTypes.func.isRequired,
  }

  state = {
    screen: 'Login',
    isProcessing: false,
    authMessage: this.props.system.authMessage,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.users.registration == null && nextProps.users.registration != null) {
      this.props.signInLocal(nextProps.users.registration.email, nextProps.users.registration.password);
    }

    if ((this.props.users.user == null && nextProps.users.user != null) || (this.props.users.user != null && nextProps.users.user == null)) {
      this.setState({ isProcessing: false, authMessage: nextProps.system.authMessage }, () => { this.props.navigation.navigate('Home'); });
    } else if (this.props.users.error) {
      this.setState({
        isProcessing: false,
        error: this.props.users.error,
        authMessage: nextProps.system.authMessage,
      });
    } else {
      this.setState({
        isProcessing: nextProps.isProcessing,
        authMessage: nextProps.system.authMessage,
      });
    }
  }

  registerUser = (user) => {
    if (!this.state.isProcessing) {
      this.props.registerUser(user);
      this.setState({
        isProcessing: true,
      });
    }
  }

  loginFacebook = (accessToken) => {
    if (!this.state.isProcessing) {
      this.props.loginFacebook(accessToken);
      this.setState({
        isProcessing: true,
      });
    }
  }

  signInLocal = (email, password) => {
    if (!this.state.isProcessing) {
      this.props.signInLocal(email, password);
      this.setState({
        isProcessing: true,
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ width: '100%', position: 'absolute', top: -20, zIndex: 100 }}>
          {(this.state.authMessage == null || this.state.authMessage.message == null) ? null : <SystemMessage message={this.state.authMessage.message} kind={this.state.authMessage.kind} />}
        </View>
        <LinearGradient
          start={{ x: 1.0, y: 0.0 }}
          end={{ x: 0.1, y: 0.9 }}
          locations={[0.1, 0.3, 0.8]}
          colors={[colorRGBA.green, colorRGBA.lightGreen, colors.shade0]}
          style={{ position: 'absolute', width: 600, height: 600, top: -300, right: -300, borderRadius: 300 }}
        />
        {this.state.isProcessing ?
          <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', position: 'absolute', zIndex: 10, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
            <ActivityIndicator style={{ position: 'absolute' }} animating size="large" />
          </View> : null}
        <TouchableOpacity style={{ position: 'absolute', top: 20, right: 20 }} onPress={() => this.props.navigation.navigate('Home')}>
          <Icon name="close" size={24} style={{ backgroundColor: 'transparent', width: 24, height: 24, margin: 10 }} color={colors.shade200} />
        </TouchableOpacity>
        <Text style={{ color: colors.shade90, fontSize: 20 }}>{this.state.screen}</Text>
        {this.state.screen === 'Register' ?
          <Register
            submitRegister={this.registerUser}
            switchToLogin={() => this.setState({ screen: 'Login' })}
            loginFacebook={this.loginFacebook}
          /> :
          <Login
            submitLogin={this.signInLocal}
            switchToRegister={() => this.setState({ screen: 'Register' })}
            loginFacebook={this.loginFacebook}
          />
        }
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.shade0,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
});
