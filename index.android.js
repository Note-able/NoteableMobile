/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Menu from './app/components/Menu/index.js';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { LoginButton } from 'react-native-fbsdk';

import { Actions, ActionConst, Router, Scene } from 'react-native-router-flux';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { appReducer } from './app/reducers';
import { getAlreadySignedInUser } from './app/actions/accountActions';
import Profile from './app/screens/Profile';
import Home from './app/screens/Home';
import AudioRecorder from './app/screens/AudioRecorder';
import Nearby from './app/screens/Nearby';
import Events from './app/screens/Events';
import Music from './app/screens/Music/index.js';


//Messages
import MessagesNavBar from './app/screens/Messages/MessagesNavBar';
import Messages from './app/screens/Messages';
import MessagesSearch from './app/screens/Messages/MessagesSearch';
import MessagesCreate from './app/screens/Messages/MessagesCreate';
import MessagesConversation from './app/screens/Messages/MessagesConversation';

const ConnectedRouter = connect()(Router);
const store = createStore(appReducer, applyMiddleware(thunk));

const style = {
    tabBarStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D93A64',
        height: 45,       
    }
};

const Scenes = Actions.create(
    <Scene key='root'>
        <Scene key='home'component={Home} hideNavBar></Scene>
        <Scene key='nearby' component={Nearby} ></Scene>
        <Scene key='profile' component={Profile}></Scene>
        <Scene key='messages' navBar={MessagesNavBar}>
            <Scene key='messages_list' component={Messages}></Scene>
            <Scene key='messages_create' component={MessagesCreate}></Scene>
            <Scene key='messages_conversation' component={MessagesConversation}></Scene>
            <Scene key='messages_search' component={MessagesSearch}></Scene>
        </Scene>
        <Scene key='events' component={Events}></Scene>
        <Scene key='music'component={Music}></Scene>
        <Scene key='recorder'component={AudioRecorder}></Scene>
    </Scene>
);

class noteableMobile extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        store.dispatch(getAlreadySignedInUser());
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
