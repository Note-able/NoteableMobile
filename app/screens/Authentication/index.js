import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
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
  getUser,
  loginFacebook,
  signInLocal,
  registerUser,
} from '../../actions/accountActions';

const mapStateToProps = state => ({
  users: state.Users,
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
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.users.registration == null && nextProps.users.registration != null) {
      this.props.signInLocal(nextProps.registration.email, nextProps.registration.password);
    }

    if ((this.props.users.user == null && nextProps.users.user != null) || (this.props.users.user != null && nextProps.users.user == null)) {
      this.props.navigation.navigate('Home');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          start={{ x: 1.0, y: 0.0 }}
          end={{ x: 0.1, y: 0.9 }}
          locations={[0.1, 0.3, 0.8]}
          colors={[colorRGBA.green, colorRGBA.lightGreen, colors.shade0]}
          style={{ position: 'absolute', width: 600, height: 600, top: -300, right: -300, borderRadius: 300 }}
        />
        <TouchableOpacity style={{ position: 'absolute', top: 20, right: 20 }} onPress={() => this.props.navigation.navigate('Home')}>
          <Icon name="close" size={24} style={{ backgroundColor: 'transparent', width: 24, height: 24, margin: 10 }} color={colors.shade200} />
        </TouchableOpacity>
        <Text style={{ color: colors.shade90, fontSize: 20 }}>{this.state.screen}</Text>
        {this.state.screen === 'Register' ?
          <Register
            submitRegister={this.props.registerUser}
            switchToLogin={() => this.setState({ screen: 'Login' })}
            loginFacebook={this.props.loginFacebook}
          /> :
          <Login
            submitLogin={this.props.signInLocal}
            switchToRegister={() => this.setState({ screen: 'Register' })}
            loginFacebook={this.props.loginFacebook}
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
