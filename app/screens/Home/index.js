import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { TabNavigator } from 'react-navigation';

import { Footer, Navigation } from '../../components/Shared';
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

const mapStateToProps = state => state;

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
});

class Home extends Component {
  static propTypes = {
    recordingActions: PropTypes.shape({}),
    playerActions: PropTypes.shape({}),
  }

  state = {
    navOpen: false,
    screen: '',
  };

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

/*
const HomeHeader = () => (
  <View style={{ backgroundColor: 'black', maxHeight: 45, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
    <Text style={{ flex: 1, color: 'white' }}>Noteable</Text>
    <SignIn />
  </View>
);
*/
