import React, { Component, PropTypes } from 'react';
import { View, TouchableHighlight, Image, Text, Animated, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import { togglePlayFlag } from '../../actions/recordingActions';

mapStateToProps = state => ({
    recording: state.recordingsReducer.currentRecording,
    audio: state.recordingsReducer.audio,
    shouldPlay: state.recordingsReducer.shouldPlay,
});

mapDispatchToProps = (dispatch) => ({
    removePlayFlag: () => { dispatch(togglePlayFlag()) },
});

class Player extends Component {
    static propTypes = {
        audio: PropTypes.object.isRequired,
    }
    
    state = {
        playing: true,
        timingBarWidth: new Animated.Value(0),
        shouldPlay: this.props.shouldPlay,
    }
    
    componentDidMount() {
        const { shouldPlay } = this.state;
        const { removePlayFlag } = this.props;
        if (shouldPlay) {
           this.startPlay();
           removePlayFlag();
        }
    }
    
    componentWillReceiveProps(nextProps) {
        const { shouldPlay, removePlayFlag } = nextProps;
        const { audio } = this.props;
        let { timingBarWidth } = this.state;
        if (shouldPlay) {
            audio.stop();
            audio.release();
            timingBarWidth = new Animated.Value(0);
            removePlayFlag();
        }        
        this.setState({shouldPlay, timingBarWidth});
    }
    
    componentDidUpdate() {
        const { shouldPlay } = this.state;
        if (shouldPlay) {
           this.startPlay();
        }
    }
    
    componentWillUnmount() {
        const { audio } = this.props;
        audio.stop();
        audio.release();
    }
    
    startPlay = () => {
        const { audio } = this.props;
        Animated.timing(
            this.state.timingBarWidth,
            {
              toValue: windowWidth,
              duration: audio.getDuration() * 1000,
            },
          ).start();
        this.playSound(audio);
    }
    
    playSound = (audio) => {
        audio.play((success) => {
            if(!success)
                console.warn('FAILED');
            else
                this.setState({ paused: true })
        });
    }
    
    render() {
        const { audio, recording } = this.props;
        return (
            <View style={{flexDirection: 'column', flex: 0, height: 60}}>
                <View style={styles.timingBarShadow} />
                <Animated.View style={[{ width: this.state.timingBarWidth }, styles.timingBar]}/>
                <View style={styles.container}>
                    <View style={styles.recordingInfo}>
                        <Text style={styles.largeText} ellipsizeMode="tail" numberOfLines={1}>{recording.name}</Text>
                        <Text style={styles.text}>{recording.date}</Text>
                    </View>
                    <TouchableHighlight style={styles.moreButton} onPress={() => { this.startPlay() }}>
                        <Image source={require('../../img/more_horiz.png')} style={styles.icon}></Image>
                    </TouchableHighlight>
                </View>
            </View>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);

const windowWidth = Dimensions.get('window').width;

const styles = {
    container: {
        flex: 1,
        height: 50,
        width: windowWidth,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 5,
        marginHorizontal: 20,
    },
    timingBar: {
        alignSelf: 'flex-start',
        backgroundColor: '#31CB94',
        height: 3,
        marginTop: -1,
    },
    timingBarShadow: {
        alignSelf: 'flex-start',
        borderBottomColor: '#31CB94',
        width: windowWidth,
        borderBottomWidth: 1,
        height: 0,
    },
    largeText: {
        fontSize: 16,
        color: '#32302f',
    },
    text: {
        color: '#7a7b86',
    },
    recordingInfo: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    moreButton: {
        flex: 1,
        marginVertical: 15,
        height: 20,
        alignSelf: 'flex-end',
    },
};
