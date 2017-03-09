import React, { Component, PropTypes } from 'react';
import { View, TouchableHighlight, Image, Text, Animated, Easing, Dimensions } from 'react-native';
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
    
    pausePlay = () => {
        const { audio } = this.props;
        this.timingAnimation.stop();
        audio.pause();
        this.setState({ shouldPlay: false, isPlaying: false, isPaused: true });
    }
    
    startPlay = () => {
        const { audio } = this.props;
        const timingBarWidth = this.state.isPaused ? this.state.timingBarWidth : new Animated.Value(0);
        this.setState({ timingBarWidth, shouldPlay: false, isPlaying: true }, () => {
            this.playAndAnimate(audio);
        });
    }
    
    playAndAnimate(audio) {
        audio.getCurrentTime((time) => {
            const duration = (audio.getDuration() - time) * 1000;
            this.timingAnimation = Animated.timing(
                this.state.timingBarWidth,
                {
                    easing: Easing.linear,
                    toValue: windowWidth,
                    duration
                },
            );
            this.timingAnimation.start();
            this.playSound(audio); 
        });  
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
                    <View style={styles.playControls}>
                        <TouchableHighlight>
                            <Image style={styles.secondaryIcon} source={require('../../img/rewind.png')}></Image>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => { 
                            if(this.state.isPlaying)
                                this.pausePlay();
                            else
                                this.startPlay(); 
                        }}>
                            <Image source={this.state.isPlaying ? require('../../img/pause.png') : require('../../img/play.png')} style={styles.primaryIcon}></Image>
                        </TouchableHighlight>
                        <TouchableHighlight>
                            <Image style={styles.secondaryIcon} source={require('../../img/fast_forward.png')}></Image>
                        </TouchableHighlight>
                    </View>
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
        alignSelf: 'stretch',
        marginLeft: 20,
    },
    primaryIcon: {
        height: 40,
        width: 40,
        marginHorizontal: 8,
    },
    secondaryIcon: {
        height: 24,
        width: 24,
    },
    playControls: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        alignSelf: 'stretch',
    },
};
