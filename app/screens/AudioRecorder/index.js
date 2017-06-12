import React from 'react';

import { View } from 'react-native';
import { connect } from 'react-redux';

import Audio from './Audio.js';
import {
  addRecording,
  fetchRecordings,
} from '../../actions/recordingActions';

import {
  startPlayer,
} from '../../actions/playerActions';

import { Header } from '../../components/Shared';

const mapDispatchToProps = dispatch => ({
  saveRecording: (name, date, duration) => dispatch(addRecording(name, date, duration)),
  fetchRecordings: () => dispatch(fetchRecordings()),
  startPlayer: recording => dispatch(startPlayer(recording)),
});

const mapStateToProps = state => ({
  recordings: state.Recordings,
});

const AudioRecorder = props => (
  <View style={{ flex: 1 }}>
    <Header openNav={props.openNav} title="Record" />
    <Audio
      fetchRecordings={props.fetchRecordings}
      loadingRecordings={props.recordings.processing}
      saveRecording={props.saveRecording}
      recordings={props.recordings.recordings}
      goToRecordings={props.goToRecordings}
      startPlayer={props.startPlayer}
    />
  </View>
  );

AudioRecorder.navigationOptions = {
  tabBarLabel: 'Setup',
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioRecorder);
