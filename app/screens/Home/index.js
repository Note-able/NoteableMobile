import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { TabNavigator } from 'react-navigation';

import {
  Footer,
  Navigation,
} from '../../components/Shared';
import { appScreens } from '../../screens';
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
  },
});

class Home extends Component {
  static propTypes = {
    recordingActions: PropTypes.shape({}),
    playerActions: PropTypes.shape({}),
    accountActions: PropTypes.shape({}),
  }

  state = {
    users: this.props.users,
    navOpen: false,
    screen: '',
  };

  componentDidMount() {
    this.props.accountActions.getCurrentUser();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.users.isProcessing && !nextProps.users.isProcessing && nextProps.users.currentUser == null) {
      this.props.navigation.navigate('Authentication');
      return;
    }

    this.setState({
      users: nextProps.users,
    });
  }

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
    if (this.state.users.currentUser == null && this.state.users.isProcessing) {
      return (
        <View style={{ backgroundColor: colors.shade10, height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.shade90, fontSize: 20, marginBottom: 20 }}>Loading</Text>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, marginTop: -20, paddingTop: 20, backgroundColor: colors.shade10 }}>
        <App
          onNavigationStateChange={this.navigationStateChange}
          screenProps={{
            screen: this.state.screen,
            recordingActions: this.props.recordingActions,
            playerActions: this.props.playerActions,
          }}
        />
        {!this.state.navOpen ? null : (
          <Navigation onSignIn={this.props.onSignIn} />
        )}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
