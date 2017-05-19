import React from 'react';

import { View } from 'react-native';
import { connect } from 'react-redux';

import Audio from './Audio.js';
import { addRecording } from '../../actions/recordingActions';
import { Header } from '../../components/Shared';

const mapDispatchToProps = dispatch => ({
  addRecording: (name, date, duration) => dispatch(addRecording(name, date, duration)),
});

const AudioRecorder = props => (
  <View style={{ flex: 1 }}>
    <Header openNav={props.openNav} title="Record" />
    <Audio addRecording={props.addRecording} />
  </View>
);

export default connect(null, mapDispatchToProps)(AudioRecorder);
