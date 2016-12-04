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

class noteableMobile extends Component {
    constructor(props) {
        super(props);

        this.state = { screen: 'Recorder' };
    }

    updateScreen = (screen) => {
        this.setState({ screen });
    }

    renderCurrentScreen = (screen) => {
        switch(screen) {
            case 'Recorder':
                return(<AudioRecorder />);
            case 'List':
                return(<RecordingList />);
            default:
                return(<AudioRecorder />);
        }
    }

    render() {
        const screen = this.renderCurrentScreen(this.state.screen);
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.welcome}>
                    Notable
                    </Text>
                    <LoginButton
                        publishPermissions={[]}
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
                </View>
                <View style={styles.screen}>
                    { screen }
                </View>
                <View style={styles.menu}>
                    <Menu updateSelected={ this.updateScreen } selected={ this.state.screen } />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    header: {
        alignSelf: 'stretch',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginLeft: 20
    },
    welcome: {
        fontSize: 30,
        textAlign: 'center',
        margin: 10,
        color: '#F5FCFF',
    },
    menu: {
        alignSelf: 'flex-end',
        backgroundColor: '#000'
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
    }
});

AppRegistry.registerComponent('noteableMobile', () => noteableMobile);
