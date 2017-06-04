import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import Realm from 'realm';

import { Recordings } from '../../components/Shared';
import Schemas from '../../realmSchemas';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { MapRecordingFromDB } from '../../mappers/recordingMapper';
import styles from './styles.js';

const realm = new Realm(Schemas.RecordingSchema);

export default class Music extends Component {
  state = {
    recordings: realm.objects('Recording').sorted('id', true),
  };

  componentDidMount() {
    this._recordings = realm.objects('Recording').sorted('id', true);
    realm.addListener('change', this.recordingsChange);
  }

  recordingsChange = () => this.setState({
    recordings: [...this._recordings.map(x => MapRecordingFromDB(x))],
  });

  render() {
    return (
      <View style={styles.recordingsContainer}>
        <Recordings recordings={this.state.recordings} />
      </View>
    );
  }
}
