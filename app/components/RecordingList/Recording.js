import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    Dimensions,
} from 'react-native';

import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';

export default class Recording extends Component {
    constructor(props) {
        super(props);
        
        this.state = { };
        this.audio = new Sound(`${this.props.recording.name}.aac`, `${RNFS.DocumentDirectoryPath}/recordings`, (error) => {
            if (error) {
                console.warn(this.setState({ error: true }), error);
            }
        });
    }
    
    play = () => {
        this.audio.play();
    }
    
    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight onPress={() => { this.play(); }}>
                    <View style={styles.playButton}></View>
                </TouchableHighlight>
                <View style={styles.recordingInfo}>
                    <Text style={styles.text}>{this.props.recording.name}</Text>
                    <Text style={styles.text}>{this.props.recording.date}</Text>
                </View>
                <Text style={styles.text}>{this.props.recording.duration}</Text>
                <TouchableHighlight style={styles.syncButton} onPress={this.props.toggleSync}>
                    { this.props.recording.isSynced ?
                    <Image source={require('../../img/sync_green.png')} style={styles.icon}></Image> :
                    <Image source={require('../../img/sync_white.png')} style={styles.icon}></Image>}
                </TouchableHighlight>
            </View>);
    }
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: windowWidth,
    },
    text : {
        color: '#F5FCFF',
    },
    recordingInfo: {
    },
    syncButton: {
        alignSelf: 'flex-end',
        marginRight: 30
    },
    playButton: {
        backgroundColor: "#00e19e",
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 30
    },
});
