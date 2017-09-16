import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import {
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

import { colors, colorRGBA } from '../../styles';
import { Recordings, RecordingModal } from '../../components/Shared';
import { debounceFunc } from '../../util.js';
import styles from './styles.js';

const mapStateToProps = state => ({
  recordings: state.RecordingsReducer,
  player: state.PlayerReducer,
  users: state.AccountReducer,
});

const mapDispatchToProps = dispatch => ({
  deleteRecording: recording => dispatch(deleteRecording(recording)),
  downloadRecording: recording => dispatch(downloadRecording(recording)),
  fetchRecordings: () => dispatch(fetchRecordings()),
  filterRecordings: filter => dispatch(fetchRecordings(filter)),
  updateRecording: recording => dispatch(updateRecording(recording)),
  uploadRecording: (recording, user) => dispatch(uploadRecording(recording, user)),
  searchRecordings: search => dispatch(fetchRecordings(null, search)),
  startPlayer: recording => dispatch(startPlayer(recording)),
  syncDownRecordings: () => dispatch(syncDownRecordings()),
  removeRecording: recording => dispatch(removeRecording(recording)),
});

class Music extends Component {
  static propTypes = {
    deleteRecording: PropTypes.func.isRequired,
    fetchRecordings: PropTypes.func.isRequired,
    filterRecordings: PropTypes.func.isRequired,
    updateRecording: PropTypes.func.isRequired,
    uploadRecording: PropTypes.func.isRequired,
    searchRecordings: PropTypes.func.isRequired,
    startPlayer: PropTypes.func.isRequired,
    syncDownRecordings: PropTypes.func.isRequired,
    removeRecording: PropTypes.func.isRequired,
  };

  state = {
    activeFilter: 'date',
    search: this.props.recordings.search || '',
    options: '',
    height: new Animated.Value(0),
    recordings: this.props.recordings,
  };

  componentWillReceiveProps(nextProps) {
    const stateUpdate = {};
    if (nextProps.screenProps.screen === 'Recordings' && this.state.screen !== 'Recordings') {
      this.props.fetchRecordings();
      stateUpdate.screen = 'Recordings';
    }

    stateUpdate.recordings = nextProps.recordings;
    this.setState(stateUpdate);
  }

  search = (search) => {
    this.setState({ search });
    debounceFunc('searchRecordings', () => {
      this.props.searchRecordings(search);
    }, 300);
  }

  showFilter = () => {
    this.setState({
      options: this.state.options === 'filter' ? '' : 'filter',
      filterOpen: !this.state.filterOpen,
    }, () => {
      this.state.height.setValue(this.state.filterOpen ? 0 : 120);
      Animated.timing(
        this.state.height, {
          easing: Easing.ease,
          toValue: this.state.filterOpen ? 120 : 0,
          duration: 100,
        },
      ).start();
    });
  }

  filter = (filter) => {
    this.props.filterRecordings(filter);
    this.setState({
      activeFilter: filter,
      options: '',
    });
  }

  editRecording = (recording) => {
    this.setState({
      modal: {
        id: recording.id,
        name: recording.name,
      },
      fileName: recording.name,
      tags: recording.tags,
      recording,
    });
  }

  updateRecording = (recordingInfo) => {
    this.props.updateRecording({
      ...this.state.recording,
      name: recordingInfo.fileName,
      tags: recordingInfo.tags,
    });

    this.setState({
      recording: null,
      modal: null,
      fileName: '',
      tags: '',
    });
  }

  render() {
    const check = <Icon name="check" size={18} style={{ width: 18, height: 18, marginRight: 4 }} color={colors.green} />;
    return (
      <View style={styles.recordingsContainer}>
        <View style={styles.headerBar}>
          <TouchableHighlight style={styles.sortOptions} onPress={this.showFilter}>
            <Icon name="filter-list" size={28} style={{ width: 28, height: 28 }} color={colors.shade90} />
          </TouchableHighlight>
          <View style={styles.searchInput}>
            <TextInput style={styles.input} value={this.state.search} onFocus={() => this.setState({ options: 'search' })} onChangeText={this.search} placeholder="Search recordings" placeholderTextColor={colors.shade90} underlineColorAndroid="transparent" />
          </View>
        </View>
        <Animated.View style={[styles.filterContainer, { height: this.state.height }]}>
          <TouchableHighlight style={styles.filterOption} onPress={() => this.filter('duration')}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.shade90, fontSize: 14 }}>Length</Text>
              {this.state.activeFilter === 'duration' ? check : null}
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.filterOption} onPress={() => this.filter('date')}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.shade90, fontSize: 14 }}>Date</Text>
              {this.state.activeFilter === 'date' ? check : null}
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.filterOption} onPress={() => this.filter('name')}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.shade90, fontSize: 14 }}>Name</Text>
              {this.state.activeFilter === 'name' ? check : null}
            </View>
          </TouchableHighlight>
        </Animated.View>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.9, y: 0.9 }}
          locations={[0.1, 0.3, 0.8]}
          colors={[colorRGBA.green, colorRGBA.lightGreen, colors.shade0]}
          style={{ position: 'absolute', width: 800, height: 800, top: -400, left: -400, borderRadius: 400 }}
        />
        <Recordings
          deleteRecording={this.props.deleteRecording}
          downloadRecording={this.props.downloadRecording}
          recordings={this.state.recordings.recordings}
          startPlayer={this.props.startPlayer}
          editRecording={this.editRecording}
          uploadRecording={this.props.uploadRecording}
          syncDownRecordings={this.props.syncDownRecordings}
          removeRecording={this.props.removeRecording}
          loadingRecordings={this.props.recordings.processing}
          currentUser={this.props.users.user}
        />
        {/* Modal */}
        <Modal
          animationType={'none'}
          transparent
          visible={this.state.modal != null}
          onRequestClose={() => { this.setState({ modal: null }); }}
        >
          <RecordingModal
            initialFileName={this.state.fileName}
            initialTags={this.state.tags}
            cancel={() => this.setState({ modal: null })}
            save={recordingInfo => this.updateRecording(recordingInfo)}
            cancelText="Cancel"
          />
        </Modal>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Music);
