import React, { Component } from 'react';

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

class AudioRecorder extends Component {
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
        <Header openNav={this.props.openNav} title="Record" />
        <Audio
          fetchRecordings={this.props.fetchRecordings}
          loadingRecordings={this.props.recordings.processing}
          saveRecording={this.props.saveRecording}
          recordings={this.props.recordings.recordings}
          goToRecordings={this.props.goToRecordings}
          startPlayer={this.props.startPlayer}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

AudioRecorder.navigationOptions = {
  tabBarLabel: 'Setup',
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioRecorder);
