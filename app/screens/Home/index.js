import React from 'react';
import { View, TouchableHighlight, Text } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { ActionConst, Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import RecordingButton from '../../components/RecordingButton.js';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({
    navigateScene: (scene) => {
        scene();
        dispatch({ type: 'changeScene' });
    },
});

const Home = ({navigateScene}) => {
    return(
        <View style={styles.container}>
            {Object.keys(views).map((view) =>        
                <TouchableHighlight key={view} style={styles.option} onPress={() => {navigateScene(views[view].scene)}}>
                    <LinearGradient colors={views[view].colors} start={[0, 0]} end={[1, 0]} style={styles.gradient}>
                        <Text style={styles.optionText}>{views[view].name}</Text>
                    </LinearGradient>
                </TouchableHighlight>
            )}
            <RecordingButton />
        </View>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const views = {
    nearby: { colors: ['rgba(49,203,148, 0.5)','rgba(24,117,220,0.5)'], name: 'Nearby', scene: () => {Actions.nearby()} },
    people: { colors: ['rgba(138,50,217, 0.5)','rgba(217,58,100,0.5)'], name: 'People', scene: () => {Actions.profile()} },
    messages: { colors: ['rgba(53,116,218, 0.5)','rgba(138,50,217,0.5)'], name: 'Messages', scene: () => {Actions.messages()} },
    events: { colors: ['rgba(240,166,62, 0.5)','rgba(234,207,63,0.5)'], name: 'Events', scene: () => {Actions.events()} },
    music: { colors: ['rgba(217,58,100, 0.5)','rgba(240,166,62,0.5)'], name: 'Music', scene: () => {Actions.music()} },
};

const styles = {
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        backgroundColor: '#D0D1D5',
    },
    option: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch'
    },
    optionText: {
        fontSize: 50,
        color: 'white',
        backgroundColor: 'transparent',
    },
    gradient: {
        flex: 1,
        backgroundColor: 'transparent',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
    }
};
