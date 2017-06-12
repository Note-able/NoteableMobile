import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { Recordings } from '../../components/Shared';
import styles from './styles.js';

import {
  startPlayer,
} from '../../actions/playerActions';

const mapDispatchToProps = dispatch => ({
  startPlayer: recording => dispatch(startPlayer(recording)),
});

const mapStateToProps = state => ({
  recordings: state.Recordings,
  player: state.Player,
});

class Music extends Component {
  static propTypes = {
    startPlayer: PropTypes.func.isRequired,
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.recordingsContainer} bounces={false}>
        <Recordings
          recordings={this.props.recordings.recordings}
          startPlayer={this.props.startPlayer}
        />
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Music);
