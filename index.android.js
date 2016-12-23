/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import RecordingList from './app/components/RecordingList/index.js';
import AudioRecorder from './app/components/AudioRecorder/index.js';
import Menu from './app/components/Menu/index.js';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { LoginButton } from 'react-native-fbsdk';

import { Actions, Router, Scene } from 'react-native-router-flux';
import { Provider, connect } from 'react-redux';
import { compose, createStore } from 'redux';
import { appReducer } from './app/reducers';

import Profile from './app/screens/Profile/index.js';
import Home from './app/screens/Home/index.js';

const ConnectedRouter = connect()(Router);
const store = compose()(createStore)(appReducer);

const Scenes = Actions.create(
    <Scene key='root'>
        <Scene key='home'component={Home}></Scene>
        <Scene key='profile' component={Profile}></Scene>
        <Scene key='music'component={RecordingList}></Scene>
        <Scene key='recorder'component={AudioRecorder}></Scene>
    </Scene>
);


class noteableMobile extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider store={store}>
                <ConnectedRouter scenes={Scenes}></ConnectedRouter>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('noteableMobile', () => noteableMobile);

/*
                <View style={styles.menu}>
                    <Menu updateSelected={ this.updateScreen } selected={ this.state.screen } />
                </View>
                
                                    <LoginButton
                        publishPermissions={["publish_actions"]}
                        onLoginFinished={
                            (error, result) => {
                                if (error) {
                                    alert("Login failed with error: " + result.error);
                                } else if (result.isCancelled) {
                                    alert("Login was cancelled");
                                } else {
                                    alert("Login was successful with permissions: " + result.grantedPermissions)
                                }
                            }
                        }
                        onLogoutFinished={() => alert("User logged out")}/>
                        
                        ------------------------------
                        
                        
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.welcome}>
                    Notable
                    </Text>
                </View>
                <View style={styles.screen}>
                    { screen }
                </View>
            </View>
*/
