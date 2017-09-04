import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { preferenceKeyValues } from '../../constants';
import { colors } from '../../styles';

import {
  addRecording,
  deleteRecording,
  fetchRecordings,
  logout as logoutRecording,
  updateRecording,
} from '../../actions/recordingActions';

import {
  startPlayer,
} from '../../actions/playerActions';

import {
  getCurrentUser,
  getUserPreferences,
  logout,
  setUserPreferences,
} from '../../actions/accountActions';

const mapStateToProps = state => ({
  users: state.Users,
});

const mapDispatchToProps = dispatch => ({
  recordingActions: {
    deleteRecording: recording => dispatch(deleteRecording(recording)),
    fetchRecordings: () => dispatch(fetchRecordings()),
    filterRecordings: filter => dispatch(fetchRecordings(filter)),
    logout: () => dispatch(logoutRecording()),
    updateRecording: recording => dispatch(updateRecording(recording)),
    saveRecording: recording => dispatch(addRecording(recording)),
    searchRecordings: search => dispatch(fetchRecordings(null, search)),
  },
  playerActions: {
    startPlayer: recording => dispatch(startPlayer(recording)),
  },
  accountActions: {
    getCurrentUser: () => dispatch(getCurrentUser()),
    getUserPreferences: () => dispatch(getUserPreferences()),
    logout: () => dispatch(logout()),
    setUserPreferences: preferencePairs => dispatch(setUserPreferences(preferencePairs)),
  },
});

const ToggleSetting = props => (
  <View style={styles.toggleContainer}>
    <Text style={styles.toggleText}>{props.text}</Text>
    <Switch onValueChange={props.onChange} value={props.value === 'true'} onTintColor={colors.green} style={styles.toggleControl} />
  </View>
);

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
    preferences: {},
  };

  componentDidMount() {
    this.props.accountActions.getCurrentUser();
    this.props.accountActions.getUserPreferences();
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.users.preferences != null
      && Object.keys(nextProps.users.preferences)
        .filter(key => this.state.preferences[key] == null || this.state.preferences[key] !== nextProps.users.preferences[key]).length !== 0
    ) {
      this.setState({ preferences: nextProps.users.preferences });
    }
  }

  logout = () => {
    this.props.recordingActions.logout();
    this.props.accountActions.logout();
  }

  login = () => {
    this.props.screenProps.stackNavigation.navigate('Authentication');
  }

  setPreference = (preferenceValue) => {
    this.props.accountActions.setUserPreferences([preferenceValue]);
    this.setState({
      preferences: {
        ...this.state.preferences,
        [preferenceValue[0]]: preferenceValue[1],
      },
    });
  }

  render() {
    const isAuthenticated = this.props.users.user != null;
    return (
      <View style={{ flex: 1, paddingTop: 40, paddingHorizontal: 20, backgroundColor: colors.shade0, height: '100%', width: '100%' }}>
        <View style={{ borderBottomColor: colors.green, borderBottomWidth: 2, padding: 4, marginBottom: 8 }}>
          <Text style={{ color: colors.shade140, fontSize: 16 }}>Network</Text>
        </View>
        <ToggleSetting onChange={value => this.setPreference([preferenceKeyValues.celluarDataKey, value.toString()])} text="Use cellular data for downloads" value={this.state.preferences[preferenceKeyValues.celluarDataKey]} />
        <ToggleSetting onChange={value => this.setPreference([preferenceKeyValues.autoDownloadKey, value.toString()])} text="Automatically download recordings" value={this.state.preferences[preferenceKeyValues.autoDownloadKey]} />
        <View style={{ borderBottomColor: colors.green, borderBottomWidth: 2, padding: 4, marginBottom: 8 }}>
          <Text style={{ color: colors.shade140, fontSize: 16 }}>Account</Text>
        </View>
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
    marginHorizontal: 4,
    width: 100,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
  },
  toggleText: {
    color: colors.shade90,
    fontSize: 14,
    lineHeight: 32,
  },
  toggleControl: {
    height: 32,
  },
});
