import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    ScrollView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { colors, gradients } from '../../styles';
import MusicList from '../../components/Music/index.js';
import Player from '../../components/Music/Player';
import { getUser } from '../../actions/accountActions';
import { fetchRecordings, initializePlayer, uploadSong } from '../../actions/recordingActions';

const mapStateToProps = (state) => ({
    showPlayer: state.profileReducer.showPlayer, 
    profile: state.userReducer.profile,
    user: state.userReducer.user,
    recordings: mapRealmResults(state.recordingsReducer.recordings),
    currentRecording: state.recordingsReducer.currentRecording,
});

const mapDispatchToProps = (dispatch) => ({
    navigateback: () => {
        Actions.pop();
    },
    getCurrentUser: (user) => { dispatch(getUser(user)); },
    getRecordings: () => dispatch(fetchRecordings()),
    initializePlayer: (currentRecording, audio) => dispatch(initializePlayer(currentRecording, audio)),
    syncRecording: (recording, user) => dispatch(uploadSong(recording, user)), 
});

class Music extends Component {    
    componentDidMount() {
        const { getRecordings } = this.props;
        getRecordings();
    }
    
    updateView = (view) => {
        // do nothing
    }
    
    render() {
        const { user, showPlayer, recordings, initializePlayer, syncRecording } = this.props;
        return(
            <View style={styles.container}>
                <MusicNavBar updateView={this.updateView} navigate={this.props.navigateback} />
                <MusicList recordings={recordings || {}} initializePlayer={initializePlayer} syncRecording={(recording) => { syncRecording(recording, user); }} />
                { showPlayer ? <Player /> : null }
            </View>
        );
    }
};

const MusicNavBar = ({navigate, updateView}) => (
    <LinearGradient colors={gradients.redToOrange} start={[0, 0]} end={[1, 0]} style={styles.gradient}>
        <View style={styles.navBar}> 
            <TouchableHighlight style={styles.navBackArrow} onPress={() => { navigate(); }}>
                <Image source={require('../../img/back_arrow.png')} style={styles.navBackArrow}/>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => { updateView('discover'); }}>
                <Text style={styles.navTitle}>Discover</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => { updateView('mymusic'); }}>
                <Text style={styles.navTitle}>My Music</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => { updateView('favorites'); }}>
                <Text style={styles.navTitle}>Favorites</Text>
            </TouchableHighlight>
        </View>
    </LinearGradient>
);

const mapRealmResults = (results) => {
    return results.reduce((map, file) => {
        map[file.name] = file;
        return map;
    }, {});
}

export default connect(mapStateToProps, mapDispatchToProps)(Music);

const styles = {
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        height: 45,
    },
    navTitle: {
        padding: 10,
        color: 'white',
        fontSize: 20,
        marginHorizontal: 10,
    },
    navBackArrow: {
        height: 30,
        width: 30,
        marginLeft: 10,
    },
    green: {
        backgroundColor: '#31CB94'
    },
    gradient: {
        height: 45,
        top: 0,
        right: 0,
        left: 0,
        backgroundColor: 'transparent',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
    }
}
