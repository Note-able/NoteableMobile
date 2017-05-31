import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import styles from './styles.js';

export default class RecentRecordings extends Component {
  static propTypes = {
    chooseRecording: PropTypes.func.isRequired,
    recentRecordings: PropTypes.arrayOf(PropTypes.shape({
      filename: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      lastModified: PropTypes.number.isRequired,
    })),
  };

  render() {
    console.log(this.props.recentRecordings);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Recent</Text>
          <Text style={styles.navigateRecordings}>{'Recordings >'}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.recentRecordings} bounces={false}>
          {this.props.recentRecordings.map(recording =>
            <TouchableHighlight onPress={this.props.chooseRecording}>
              <View style={styles.row}>
                <Text style={styles.rowTitle}>{recording.name}</Text>
                <Text style={styles.rowTitle}>{recording.duration}</Text>
                <Text style={styles.rowTitle}>{recording.description}</Text>
              </View>
            </TouchableHighlight>,
          )}
        </ScrollView>
      </View>
    );
  }
}
