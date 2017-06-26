import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { colors } from '../../styles';

import {
  addRecording,
  deleteRecording,
  fetchRecordings,
  updateRecording,
} from '../../actions/recordingActions';

import {
  startPlayer,
} from '../../actions/playerActions';

import {
  getCurrentUser,
  logout,
} from '../../actions/accountActions';

const mapStateToProps = state => ({
  users: state.Users,
});

const mapDispatchToProps = dispatch => ({
  recordingActions: {
    deleteRecording: recording => dispatch(deleteRecording(recording)),
    fetchRecordings: () => dispatch(fetchRecordings()),
    filterRecordings: filter => dispatch(fetchRecordings(filter)),
    updateRecording: recording => dispatch(updateRecording(recording)),
    saveRecording: recording => dispatch(addRecording(recording)),
    searchRecordings: search => dispatch(fetchRecordings(null, search)),
  },
  playerActions: {
    startPlayer: recording => dispatch(startPlayer(recording)),
  },
  accountActions: {
    getCurrentUser: () => dispatch(getCurrentUser()),
    logout: () => dispatch(logout()),
  },
});

class Settings extends Component {
  static propTypes = {
    accountActions: PropTypes.shape({
      getCurrentUser: PropTypes.func.isRequired,
    }),
    users: PropTypes.shape({}),
  };

  state = {
    navOpen: false,
    screen: '',
  };

  componentDidMount() {
    this.props.accountActions.getCurrentUser();
  }

  logout = () => {
    this.props.accountActions.logout();
  }

  login = () => {
    this.props.navigation.navigate('Authentication');
  }

  render() {
    const isAuthenticated = this.props.users.user != null;
    return (
      <View style={{ flex: 1, paddingTop: 40, paddingHorizontal: 20, backgroundColor: colors.shade0, height: '100%', width: '100%' }}>
        <Text style={{ color: colors.shade90, fontSize: 16 }}>Account</Text>
        <TouchableOpacity onPress={isAuthenticated ? this.logout : this.login}>
          <View style={styles.authButton}>
            <Text>{isAuthenticated ? 'Signout' : 'Login'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

const styles = StyleSheet.create({
  authButton: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 2,
    height: 32,
    justifyContent: 'center',
    marginTop: 12,
    width: 100,
  },
});
