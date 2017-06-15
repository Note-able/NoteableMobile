import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';

import AudioRecorder from '../AudioRecorder';
import { Footer, Navigation } from '../../components/Shared';
import styles from './main-styles';
import { onSignIn } from '../../actions/accountActions';
import { TabNavigator } from 'react-navigation';
import { appScreens } from '../../screens';
import { colors } from '../../styles';

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
  navigateScene: (scene) => {
    scene();
    dispatch({ type: 'changeScene' });
  },
  onSignIn: (result) => { dispatch(onSignIn(result)); },
});
// navigateScene(views[view].scene);

/*
  propTypes = {
    navigateScene: typeof function
  }
        <AudioRecorder openNav={() => this.setState({ navOpen: true })} goToRecordings={() => { navigate('Music'); }} />
        <Footer />
 */
class Home extends Component {
  static propTypes = {
    navigateScene: PropTypes.func.isRequired,
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
  // dive into nested navigators
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
          screenProps={{ screen: this.state.screen }}
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
