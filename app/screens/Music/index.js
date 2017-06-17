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

import { colors, colorRGBA } from '../../styles';
import { Recordings, CustomModal } from '../../components/Shared';
import { debounceFunc } from '../../util.js';
import styles from './styles.js';

const mapStateToProps = state => ({
  recordings: state.Recordings,
  player: state.Player,
});

class Music extends Component {
  static propTypes = {
    recordingActions: PropTypes.shape({}),
    playerActions: PropTypes.shape({}),
  };

  state = {
    search: this.props.recordings.search || '',
    options: '',
    recordingActions: this.props.screenProps.recordingActions,
    playerActions: this.props.screenProps.playerActions,
    height: new Animated.Value(0),
  };

  search = (search) => {
    this.setState({ search });
    debounceFunc('searchRecordings', () => {
      this.state.recordingActions.searchRecordings(search);
    }, 300);
  }

  showFilter = () => {
    this.setState({
      options: this.state.options === 'filter' ? '' : 'filter',
      height: new Animated.Value(0),
    }, () => {
      Animated.timing(
        this.state.height, {
          easing: Easing.linear,
          toValue: 120,
          duration: 100,
        },
      ).start();
    });
  }

  filter = (filter) => {
    this.state.recordingActions.filterRecordings(filter);
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
      recording,
    });
  }

  updateRecording = (recordingInfo) => {
    this.state.recordingActions.updateRecording({
      ...this.state.recording,
      name: recordingInfo.fileName,
      tags: recordingInfo.tags,
    });

    this.setState({
      recording: null,
      modal: null,
      fileName: '',
    });
  }

  render() {
    const check = <Icon name="check" size={18} style={{ width: 18, height: 18, marginRight: 4 }} color={colors.green} />;
    return (
      <ScrollView contentContainerStyle={styles.recordingsContainer} bounces={false}>
        <View style={styles.headerBar}>
          <TouchableHighlight style={styles.sortOptions} onPress={this.showFilter}>
            <Icon name="filter-list" size={28} style={{ width: 28, height: 28 }} color={colors.shade90} />
          </TouchableHighlight>
          <View style={styles.searchInput}>
            <TextInput style={styles.input} value={this.state.search} onFocus={() => this.setState({ options: 'search' })} onChangeText={this.search} placeholder="Search recordings" placeholderTextColor={colors.shade90} />
          </View>
        </View>
        {this.state.options === 'filter' ? <Animated.View style={[styles.filterContainer, { height: this.state.height }]}>
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
        </Animated.View> : null }
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.9, y: 0.9 }}
          locations={[0.1, 0.3, 0.8]}
          colors={[colorRGBA.green, colorRGBA.lightGreen, colors.shade0]}
          style={{ position: 'absolute', width: 800, height: 800, top: -400, left: -400, borderRadius: 400 }}
        />
        <Recordings
          deleteRecording={this.state.recordingActions.deleteRecording}
          recordings={this.props.recordings.recordings}
          startPlayer={this.state.playerActions.startPlayer}
          editRecording={this.editRecording}
        />
        {/* Modal */}
        <Modal
          animationType={'none'}
          transparent
          visible={this.state.modal != null}
        >
          <CustomModal
            initialValue={this.state.fileName}
            cancel={() => this.setState({ modal: null })}
            save={recordingInfo => this.updateRecording(recordingInfo)}
          />
        </Modal>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps)(Music);
