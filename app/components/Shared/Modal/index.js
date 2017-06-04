import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles.js';


export default class Header extends Component {
  static propTypes = {
    acceptText: PropTypes.string.isRequired,
    cancelText: PropTypes.string.isRequired,
    onAccept: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  }

  render() {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{this.props.title}</Text>
          {this.props.children}
          <View style={styles.buttonRow}>
            <TouchableHighlight style={styles.buttonOption} onPress={this.props.onCancel}>
              <Text style={{ textAlign: 'center', color: '#95989A', fontSize: 16 }}>{this.props.cancelText}</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.buttonOption} onPress={this.props.onAccept}>
              <Text style={{ textAlign: 'center', color: '#95989A', fontSize: 16 }}>{this.props.acceptText}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}
