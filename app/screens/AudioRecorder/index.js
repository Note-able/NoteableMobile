import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';

import Audio from './Audio.js';

import {
  addRecording,
  getRecordingTitle,
  deleteRecording,
  downloadRecording,
  fetchRecordings,
  removeRecording,
  syncDownRecordings,
  updateRecording,
  uploadRecording,
} from '../../actions/recordingActions';

import {
  startPlayer,
} from '../../actions/playerActions';

import {
  getCurrentUser,
} from '../../actions/accountActions';

const mapStateToProps = state => ({
  recordings: state.Recordings,
});

const mapDispatchToProps = dispatch => ({
  deleteRecording: (recording, user) => dispatch(deleteRecording(recording, user)),
  downloadRecording: recording => dispatch(downloadRecording(recording)),
  fetchRecordings: () => dispatch(fetchRecordings()),
  filterRecordings: filter => dispatch(fetchRecordings(filter)),
  updateRecording: recording => dispatch(updateRecording(recording)),
  removeRecording: recording => dispatch(removeRecording(recording)),
  saveRecording: recording => dispatch(addRecording(recording)),
  searchRecordings: search => dispatch(fetchRecordings(null, search)),
  syncDownRecordings: () => dispatch(syncDownRecordings()),
  startPlayer: recording => dispatch(startPlayer(recording)),
  getCurrentUser: () => dispatch(getCurrentUser()),
  uploadRecording: recording => dispatch(uploadRecording(recording)),
});

class AudioRecorder extends Component {
  static propTypes = {
    deleteRecording: PropTypes.func.isRequired,
    downloadRecording: PropTypes.func.isRequired,
    fetchRecordings: PropTypes.func.isRequired,
    updateRecording: PropTypes.func.isRequired,
    removeRecording: PropTypes.func.isRequired,
    saveRecording: PropTypes.func.isRequired,
    startPlayer: PropTypes.func.isRequired,
    syncDownRecordings: PropTypes.func.isRequired,
    uploadRecording: PropTypes.func.isRequired,
  };

  state = {
    screen: '',
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.screen === 'Record' && this.state.screen === '') {
      this.props.fetchRecordings();
      this.setState({
        screen: 'Record',
      });
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Audio
          getRecordingTitle={getRecordingTitle}
          deleteRecording={this.props.deleteRecording}
          downloadRecording={this.props.downloadRecording}
          fetchRecordings={this.props.fetchRecordings}
          loadingRecordings={this.props.recordings.processing}
          saveRecording={this.props.saveRecording}
          recordings={this.props.recordings.recordings}
          goToRecordings={this.props.goToRecordings}
          startPlayer={this.props.startPlayer}
          navigation={this.props.navigation}
          updateRecording={this.props.updateRecording}
          uploadRecording={this.props.uploadRecording}
          syncDownRecordings={this.props.syncDownRecordings}
          removeRecording={this.props.removeRecording}
        />
      </View>
    );
  }
}

AudioRecorder.navigationOptions = {
  tabBarLabel: 'Setup',
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioRecorder);
