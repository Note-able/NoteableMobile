import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { Footer } from '../../components/Shared';

export default class Layout extends Component {
  render() {
    return (
      <View>
        {this.props.children.map(scene => React.createElement(scene.component, 'der['))}
        <Footer {...this.props.navigationState} />
      </View>
    );
  }
}
