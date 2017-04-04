import React, { PropTypes } from 'react';

import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import Audio from './Audio.js';
import { addRecording } from '../../actions/recordingActions';

const styles = StyleSheet.create({
  navBar: {
    top: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8163E',
    height: 50,
  },
  navTitle: {
    padding: 10,
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
  },
});

const mapDispatchToProps = dispatch => ({
  addRecording: (name, date, duration) => dispatch(addRecording(name, date, duration)),
});

const AudioRecorder = props => (
  <View style={{ flex: 1 }}>
    <RecordingHeader />
    <Audio addRecording={props.addRecording} />
  </View>
);

AudioRecorder.propTypes = {
  addRecording: PropTypes.func.isRequired,
};

const RecordingHeader = () => (
  <View style={styles.navBar}>
    <Text style={styles.navTitle}>Record</Text>
    <TouchableHighlight style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => { Actions.pop(); }}>
      <Image source={require('../../img/close.png')} style={{ height: 30, width: 30 }} />
    </TouchableHighlight>
  </View>
);

export default connect(null, mapDispatchToProps)(AudioRecorder);
