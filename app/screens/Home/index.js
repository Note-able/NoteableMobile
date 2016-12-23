import React from 'react';
import { View, TouchableHighlight, Text } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { ActionConst, Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

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
        </View>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const views = {
    nearby: { colors: ['rgba(49,203,148, 0.5)','rgba(53,116,218,0.5)'], name: 'Nearby', scene: () => {Actions.nearby()} },
    people: { colors: ['rgba(49,12,148, 0.5)','rgba(5,116,218,0.5)'], name: 'People', scene: () => {Actions.profile()} },
    messages: { colors: ['rgba(12,54,65, 0.5)','rgba(53,14,100,0.5)'], name: 'Messages', scene: () => {Actions.messages()} },
    events: { colors: ['rgba(156,203,148, 0.5)','rgba(68,150,199,0.5)'], name: 'Events', scene: () => {Actions.events()} },
    music: { colors: ['rgba(49,203,100, 0.5)','rgba(53,90,17,0.5)'], name: 'Music', scene: () => {Actions.music()} },
};

const styles = {
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
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
    nearby: {
        
    },
    gradient: {
        flex: 1,
        backgroundColor: 'transparent',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
    }
};
