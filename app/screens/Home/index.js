import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';

import AudioRecorder from '../AudioRecorder';
import { Navigation } from '../../components/Shared';
import styles from './main-styles';
import { onSignIn } from '../../actions/accountActions';

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
 */
class Home extends Component {
  static propTypes = {
    navigateScene: PropTypes.func.isRequired,
  }

  state = {
    navOpen: false,
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <AudioRecorder openNav={() => this.setState({ navOpen: true })} goToRecordings={() => { navigate('Music'); }} />
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
