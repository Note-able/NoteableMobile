import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  NetInfo,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { TabNavigator } from 'react-navigation';

import {
  Footer,
  SystemMessage,
} from '../../components/Shared';
import { appScreens } from '../../screens';
import { colors } from '../../styles';

import {
  addRecording,
  deleteRecording,
  fetchRecordings,
  syncDownRecordings,
  updateRecording,
} from '../../actions/recordingActions';

import {
  startPlayer,
} from '../../actions/playerActions';

import {
  getCurrentUser,
} from '../../actions/accountActions';

const App = TabNavigator(appScreens, {
  tabBarPosition: 'bottom',
  initialRouteName: 'Recordings',
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
  users: state.Users,
  systemMessage: state.SystemMessage,
  recordings: state.Recordings,
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
});

class Home extends Component {
  static propTypes = {
    recordingActions: PropTypes.shape({}),
    playerActions: PropTypes.shape({}),
    accountActions: PropTypes.shape({}),
    users: PropTypes.shape({}),
    recordings: PropTypes.shape({}),
  }

  state = {
    users: this.props.users,
    navOpen: false,
    screen: '',
    systemMessage: null,
    isProcessing: true,
    isConnected: true,
  };

  componentDidMount() {
    this.props.accountActions.getCurrentUser();
    NetInfo.addEventListener('change', this.handleConnectivityChange);
    NetInfo.fetch().done((reach) => { this.setState({ isConnected: reach !== 'none' }); });
  }

  componentWillReceiveProps(nextProps) {
    let isProcessing = false;
    if (this.props.users.user == null && nextProps.users.user != null && !this.state.isProcessing) {
      this.props.recordingActions.syncDownRecordings();
      isProcessing = true;
    }

    this.setState({
      isProcessing,
      systemMessage: nextProps.systemMessage,
    });
  }

  handleConnectivityChange = reach => this.setState({ isConnected: reach !== 'none' });

  getCurrentRouteName = (navigationState) => {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    if (route.routes) {
      return this.getCurrentRouteName(route);
    }
    return route.routeName;
  }

  navigationStateChange = (prevState, currentState) => {
    this.setState({
      screen: this.getCurrentRouteName(currentState),
    });
  }

  render() {
    if ((this.state.users.user == null || this.state.users.user.id != null) && this.state.isProcessing) {
      return (
        <View style={{ backgroundColor: colors.shade10, height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.shade90, fontSize: 20, marginBottom: 20 }}>Loading</Text>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, marginTop: -20, paddingTop: 20, backgroundColor: colors.shade10 }}>
        {this.state.systemMessage == null || this.state.systemMessage.message == null ? null : <SystemMessage message={this.state.systemMessage.message} kind={this.state.systemMessage.kind} />}
        {this.state.isConnected ? null : <SystemMessage message="No internet connection" kind="error" />}
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
