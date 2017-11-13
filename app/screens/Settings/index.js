import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
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

import { startPlayer } from '../../actions/playerActions';

import {
  getCurrentUser,
  getUserPreferences,
  logout,
  setUserPreferences,
} from '../../actions/accountActions';

const mapStateToProps = state => ({
  users: state.AccountReducer,
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
    <Switch
      onValueChange={props.onChange}
      value={props.value === 'true'}
      onTintColor={colors.green}
      style={styles.toggleControl}
    />
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
    email: this.props.users.user != null ? this.props.users.user.email : '',
  };

  componentDidMount() {
    this.props.accountActions.getCurrentUser();
    this.props.accountActions.getUserPreferences();
  }

  componentWillReceiveProps = (nextProps) => {
    if (
      nextProps.users.preferences != null &&
      Object.keys(nextProps.users.preferences).filter(
        key =>
          this.state.preferences[key] == null ||
          this.state.preferences[key] !== nextProps.users.preferences[key],
      ).length !== 0
    ) {
      this.setState({ preferences: nextProps.users.preferences });
    }
  };

  logout = () => {
    this.props.recordingActions.logout();
    this.props.accountActions.logout();
  };

  login = () => {
    this.props.screenProps.stackNavigation.navigate('Authentication');
  };

  setPreference = (preferenceValue) => {
    this.props.accountActions.setUserPreferences([preferenceValue]);
    this.setState({
      preferences: {
        ...this.state.preferences,
        [preferenceValue[0]]: preferenceValue[1],
      },
    });
  };

  renderProfileRows = () => (
    <View>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>Email</Text>
        <TextInput style={styles.editTextRow} editable={false} value={this.state.email} />
      </View>
    </View>
  )

  render() {
    const isAuthenticated = this.props.users.user != null;
    return (
      <View
        style={{
          flex: 1,
          paddingTop: 40,
          paddingHorizontal: 20,
          backgroundColor: colors.shade0,
          height: '100%',
          width: '100%',
        }}
      >
        <View
          style={{
            borderBottomColor: colors.green,
            borderBottomWidth: 1,
            padding: 4,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: colors.shade140, fontSize: 16 }}>Network</Text>
        </View>
        <ToggleSetting
          onChange={value =>
            this.setPreference([preferenceKeyValues.celluarDataKey, value.toString()])
          }
          text="Use cellular data for downloads"
          value={this.state.preferences[preferenceKeyValues.celluarDataKey]}
        />
        <View
          style={{
            borderBottomColor: colors.green,
            borderBottomWidth: 1,
            padding: 4,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: colors.shade140, fontSize: 16 }}>Account</Text>
        </View>
        {isAuthenticated && this.renderProfileRows()}
        <TouchableOpacity style={{ width: 100 }} onPress={isAuthenticated ? this.logout : this.login}>
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
    marginTop: 36,
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
  row: {
    flexDirection: 'row',
    height: 36,
    justifyContent: 'center',
    width: '100%',
    marginHorizontal: -2,
  },
  rowLabel: {
    height: 36,
    fontSize: 14,
    width: '20%',
    minWidth: 75,
    textAlign: 'center',
    lineHeight: 36,
    color: colors.shade90,
  },
  editTextRow: {
    fontSize: 16,
    height: 36,
    maxWidth: 300,
    width: '80%',
    borderColor: colors.shade40,
    borderWidth: 1,
    borderRadius: 4,
    color: colors.shade140,
    paddingHorizontal: 12,
  },
});
