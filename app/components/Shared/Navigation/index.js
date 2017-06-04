import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableHighlight,
  Text,
  View,
} from 'react-native';

import styles from './styles.js';
import SignInModal from '../../SignInModal';

export default class Navigation extends Component {
  static propTypes = {
    onSignIn: PropTypes.func.isRequired,
  };

  state = {
    showSignIn: false,
  }

  toggleSignIn = (value) => {
    this.setState({ showSignIn: value });
  }

  render() {
    return (
      <View style={styles.navContainer}>
        <TouchableHighlight onPress={() => { this.toggleSignIn(true); }}>
          <Text>Sign in</Text>
        </TouchableHighlight>

        <SignInModal onSuccess={this.props.onSignIn} close={() => { this.toggleSignIn(false); }} visible={this.state.showSignIn} />
      </View>
    );
  }
}
