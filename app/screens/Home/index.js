import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, AppState, NetInfo, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { TabNavigator } from 'react-navigation';
import BackgroundFetch from 'react-native-background-fetch';

import { Footer, SystemMessage } from '../../components';
import { appScreens } from '../../screens';
import { colors } from '../../styles';

import {
  addRecording,
  deleteRecording,
  fetchRecordings,
  syncDownRecordings,
  updateRecording,
} from '../../actions/recordingActions';

import { startPlayer } from '../../actions/playerActions';

import { getCurrentUser } from '../../actions/accountActions';

import { networkConnectivityChange, runBackgroundRequests } from '../../actions/systemActions';

const App = TabNavigator(appScreens, {
  tabBarPosition: 'bottom',
  initialRouteName: 'Record',
  tabBarOptions: {
    activeTintColor: 'blue',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: colors.shade0,
    },
  },
  tabBarComponent: Footer,
});

const mapStateToProps = state => ({
  users: state.AccountReducer,
  system: state.SystemReducer,
  recordings: state.RecordingsReducer,
});

const mapDispatchToProps = dispatch => ({
  recordingActions: {
    deleteRecording: recording => dispatch(deleteRecording(recording)),
    fetchRecordings: () => dispatch(fetchRecordings()),
    filterRecordings: filter => dispatch(fetchRecordings(filter)),
    updateRecording: recording => dispatch(updateRecording(recording)),
    saveRecording: recording => dispatch(addRecording(recording)),
    searchRecordings: search => dispatch(fetchRecordings(null, search)),
    syncDownRecordings: () => dispatch(syncDownRecordings()),
  },
  playerActions: {
    startPlayer: recording => dispatch(startPlayer(recording)),
  },
  accountActions: {
    getCurrentUser: () => dispatch(getCurrentUser()),
  },
  systemActions: {
    networkConnectivityChange: reach => dispatch(networkConnectivityChange(reach)),
    runBackgroundRequests: () => dispatch(runBackgroundRequests()),
  },
});

class Home extends Component {
  static propTypes = {
    recordingActions: PropTypes.shape({}),
    playerActions: PropTypes.shape({}),
    accountActions: PropTypes.shape({}),
    users: PropTypes.shape({}),
    recordings: PropTypes.shape({}),
    system: PropTypes.shape({}),
  };

  state = {
    users: this.props.users,
    navOpen: false,
    screen: '',
    systemMessage: this.props.system.systemMessage,
    isProcessing: true,
    isConnected: true,
    recordings: this.props.recordings,
    network: this.props.system.network,
    appState: AppState.currentState,
  };

  componentDidMount() {
    if (this.props.users.user == null) {
      this.props.accountActions.getCurrentUser();
    }
    NetInfo.addEventListener('change', this.handleConnectivityChange);
    NetInfo.fetch().done((reach) => {
      this.setState({ isConnected: reach !== 'none' });
      this.props.systemActions.networkConnectivityChange(reach);
    });
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    NetInfo.removeEventListener('change', this.handleConnectivityChange);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.users.user == null && nextProps.users.user != null && !this.state.isProcessing) {
      this.props.recordingActions.syncDownRecordings();
    }

    this.setState({
      isProcessing: nextProps.isProcessing,
      systemMessage: nextProps.system.systemMessage,
      network: nextProps.system.network,
      recordings: nextProps.recordings,
    });
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/active/) && nextAppState === 'background') {
      BackgroundFetch.status((status) => {
        if (status === BackgroundFetch.STATUS_AVAILABLE) {
          this.props.systemActions.runBackgroundRequests();
        }
      });
    }

    this.setState({ appState: nextAppState });
  };

  handleConnectivityChange = reach => this.props.systemActions.networkConnectivityChange(reach);

  getCurrentRouteName = (navigationState) => {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    if (route.routes) {
      return this.getCurrentRouteName(route);
    }
    return route.routeName;
  };

  navigationStateChange = (prevState, currentState) => {
    this.setState({
      screen: this.getCurrentRouteName(currentState),
    });
  };

  render() {
    if (
      (this.state.users.user == null || this.state.users.user.id != null) &&
      this.state.isProcessing
    ) {
      return (
        <View
          style={{
            backgroundColor: colors.shade10,
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.shade90, fontSize: 20, marginBottom: 20 }}>Loading</Text>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, marginTop: -20, paddingTop: 20, backgroundColor: colors.shade10 }}>
        {(this.state.systemMessage == null || this.state.systemMessage.message == null) &&
          !this.state.recordings.isProcessing ? null : (
            <SystemMessage
              message={this.state.systemMessage.message}
              kind={this.state.systemMessage.kind}
            />
          )}
        {this.state.isConnected ? null : (
          <SystemMessage message="No internet connection" kind="error" />
        )}
        <App
          onNavigationStateChange={this.navigationStateChange}
          screenProps={{
            screen: this.state.screen,
            recordingActions: this.props.recordingActions,
            playerActions: this.props.playerActions,
            stackNavigation: this.props.navigation,
          }}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
