import React, { Component } from 'react';

import { View } from 'react-native';
import { connect } from 'react-redux';

import Audio from './Audio.js';

const mapStateToProps = state => ({
  recordings: state.Recordings,
});

class AudioRecorder extends Component {
  state = {
    screen: '',
    recordingActions: this.props.screenProps.recordingActions,
    playerActions: this.props.screenProps.playerActions,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.screen === 'Record' && this.state.screen === '') {
      this.state.recordingActions.fetchRecordings();
      this.setState({
        screen: 'Record',
      });
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Audio
          deleteRecording={this.state.recordingActions.deleteRecording}
          fetchRecordings={this.state.recordingActions.fetchRecordings}
          loadingRecordings={this.props.recordings.processing}
          saveRecording={this.state.recordingActions.saveRecording}
          recordings={this.props.recordings.recordings}
          goToRecordings={this.props.goToRecordings}
          startPlayer={this.state.playerActions.startPlayer}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

AudioRecorder.navigationOptions = {
  tabBarLabel: 'Setup',
};

export default connect(mapStateToProps)(AudioRecorder);
