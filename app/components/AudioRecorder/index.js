import React, {Component} from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Modal,
    TextInput
} from 'react-native';

import Audio from './Audio.js';
import Realm from 'realm';
import { connect } from 'react-redux';

import { addRecording } from '../../actions/recordingActions';
import { RecordingSchema } from '../../realmSchemas';

const mapDispatchToProps = (dispatch) => ({
    addRecording: (name, date, duration) => dispatch(addRecording(name, date, duration)),
});

class AudioRecorder extends Component {
    render () {
        return (
            <View style={{flex: 1}}>
                <Audio addRecording={this.props.addRecording} />
            </View>
        );
    }
}

export default connect(null, mapDispatchToProps)(AudioRecorder)