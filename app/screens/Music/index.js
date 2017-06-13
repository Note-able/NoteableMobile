import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { colors } from '../../styles';
import { Recordings } from '../../components/Shared';
import { debounceFunc } from '../../util.js';
import styles from './styles.js';

import {
  searchRecordings,
} from '../../actions/recordingActions';

import {
  startPlayer,
} from '../../actions/playerActions';

const mapDispatchToProps = dispatch => ({
  searchRecordings: search => dispatch(searchRecordings(search)),
  startPlayer: recording => dispatch(startPlayer(recording)),
});

const mapStateToProps = state => ({
  recordings: state.Recordings,
  player: state.Player,
});

class Music extends Component {
  static propTypes = {
    searchRecordings: PropTypes.func.isRequired,
    startPlayer: PropTypes.func.isRequired,
  };

  state = {
    search: this.props.recordings.search || '',
  };

  search = (search) => {
    this.setState({ search });
    debounceFunc('searchRecordings', () => {
      this.props.searchRecordings(search);
    }, 300);
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.recordingsContainer} bounces={false}>
        <View style={styles.headerBar}>
          <View style={styles.sortOptions}>
            <Icon name="check-box-outline-blank" size={28} style={{ width: 28, height: 28 }} color={colors.shade90} />
          </View>
          <View style={styles.searchInput}>
            <TextInput style={styles.input} value={this.props.recordings.search} onChangeText={this.search} placeholder="Search recordings" placeholderTextColor={colors.shade90} />
          </View>
        </View>
        <Recordings
          recordings={this.props.recordings.recordings}
          startPlayer={this.props.startPlayer}
        />
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Music);
