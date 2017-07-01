import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { colors, colorRGBA } from '../../styles';
import { Login, Register } from '../../components/Authentication';
import {
  getUser,
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
});

class Authentication extends Component {
  static propTypes = {
    getCurrentUser: PropTypes.func.isRequired,
    users: PropTypes.shape({}),
  }

  state = {
    screen: 'Login',
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.users.registration == null && nextProps.users.registration != null) {
      this.props.signInLocal(nextProps.registration.email, nextProps.registration.password);
    }

    console.log(this.props.users, nextProps.users);

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
        <Text style={{ color: colors.shade90, fontSize: 20 }}>{this.state.screen}</Text>
        {this.state.screen === 'Register' ?
          <Register submitRegister={this.props.registerUser} switchToLogin={() => this.setState({ screen: 'Login' })} /> :
          <Login submitLogin={this.props.signInLocal} switchToRegister={() => this.setState({ screen: 'Register' })} />
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
