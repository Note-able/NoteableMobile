import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { colors, colorRGBA } from '../../styles';
import { Recordings } from '../../components/Shared';
import { debounceFunc } from '../../util.js';
import styles from './styles.js';

import {
  deleteRecording,
  searchRecordings,
} from '../../actions/recordingActions';

import {
  startPlayer,
} from '../../actions/playerActions';

const mapDispatchToProps = dispatch => ({
  deleteRecording: recording => dispatch(deleteRecording(recording)),
  searchRecordings: search => dispatch(searchRecordings(search)),
  startPlayer: recording => dispatch(startPlayer(recording)),
});

const mapStateToProps = state => ({
  recordings: state.Recordings,
  player: state.Player,
});

class Music extends Component {
  static propTypes = {
    deleteRecording: PropTypes.func.isRequired,
    searchRecordings: PropTypes.func.isRequired,
    startPlayer: PropTypes.func.isRequired,
  };

  state = {
    search: this.props.recordings.search || '',
    options: '',
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
          <TouchableHighlight style={styles.sortOptions} onPress={() => this.setState({ options: 'filter' })}>
            <Icon name="filter-list" size={28} style={{ width: 28, height: 28 }} color={colors.shade90} />
          </TouchableHighlight>
          <View style={styles.searchInput}>
            <TextInput style={styles.input} value={this.state.search} onFocus={() => this.setState({ options: 'search' })} onChangeText={this.search} placeholder="Search recordings" placeholderTextColor={colors.shade90} />
          </View>
          {this.state.options === 'filter' ? <View style={styles.filterContainer}>
            <TouchableHighlight style={styles.filterOption}><Text style={{ color: colors.shade90 }}>Date</Text></TouchableHighlight>
            <TouchableHighlight style={styles.filterOption}><Text style={{ color: colors.shade90 }}>Length</Text></TouchableHighlight>
            <TouchableHighlight style={styles.filterOption}><Text style={{ color: colors.shade90 }}>Name</Text></TouchableHighlight>
          </View> : null }
        </View>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.9, y: 0.9 }}
          locations={[0.1, 0.3, 0.8]}
          colors={[colorRGBA.green, colorRGBA.lightGreen, colors.shade0]}
          style={{ position: 'absolute', width: 800, height: 800, top: -400, left: -400, borderRadius: 400 }}
        />
        <Recordings
          deleteRecording={this.props.deleteRecording}
          recordings={this.props.recordings.recordings}
          startPlayer={this.props.startPlayer}
        />
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Music);
