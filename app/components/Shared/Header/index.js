import React, { Component } from 'react';
import {
  Image,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles.js';


export default class Header extends Component {
  static propTypes = {
    openNav: PropTypes.func,
    title: PropTypes.string.isRequired,
  }

  render() {
    return (
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>{this.props.title}</Text>
        <TouchableHighlight style={styles.navButton} onPress={this.props.openNav}>
          <Image source={require('../../../img/close.png')} style={{ height: 30, width: 30 }} />
        </TouchableHighlight>
      </View>
    );
  }
}
