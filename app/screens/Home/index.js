import React from 'react';
import { View, TouchableHighlight, Text } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { ActionConst, Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import RecordingButton from '../../components/RecordingButton.js';
import SignIn from '../../components/SignIn';

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  navigateScene: (scene) => {
      scene();
      dispatch({ type: 'changeScene' });
    },
});

const Home = ({ navigateScene }) => (
        <View style={styles.container}>
            <HomeHeader />
            {Object.keys(views).map((view) =>        
                <TouchableHighlight key={view} style={styles.option} onPress={() => {navigateScene(views[view].scene)}}>
                    <LinearGradient colors={views[view].colors} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.gradient}>
                        <Text style={styles.optionText}>{views[view].name}</Text>
                    </LinearGradient>
                </TouchableHighlight>
            )}
            <RecordingButton />
        </View>
    );

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const HomeHeader = () => (
  <View style={{ backgroundColor: 'black', maxHeight: 45, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ flex: 1, color: 'white' }}>Noteable</Text>
      <SignIn />
    </View>
);

const views = {
  nearby: { colors: ['rgba(49,203,148, 0.5)', 'rgba(24,117,220,0.5)'], name: 'Nearby', scene: () => { Actions.nearby(); } },
  people: { colors: ['rgba(138,50,217, 0.5)', 'rgba(217,58,100,0.5)'], name: 'People', scene: () => { Actions.profile() ;} },
  messages: { colors: ['rgba(53,116,218, 0.5)', 'rgba(138,50,217,0.5)'], name: 'Messages', scene: () => { Actions.messages(); } },
  events: { colors: ['rgba(240,166,62, 0.5)', 'rgba(234,207,63,0.5)'], name: 'Events', scene: () => { Actions.events(); } },
  music: { colors: ['rgba(217,58,100, 0.5)', 'rgba(240,166,62,0.5)'], name: 'Music', scene: () => { Actions.music(); } },
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
      alignSelf: 'stretch',
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
    },
};
