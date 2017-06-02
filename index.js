import React, { Component } from 'react';
import { Actions, Router, Scene } from 'react-native-router-flux';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Answers } from 'react-native-fabric';


import { appReducer } from './app/reducers';
import { getAlreadySignedInUser } from './app/actions/accountActions';
import Profile from './app/screens/Profile/index.js';
import Home from './app/screens/Home';
import AudioRecorder from './app/screens/AudioRecorder';
import Nearby from './app/screens/Nearby';
import Events from './app/screens/Events';
import Music from './app/screens/Music/index.js';


// Messages
import MessagesNavBar from './app/screens/Messages/MessagesNavBar';
import Messages from './app/screens/Messages';
import MessagesSearch from './app/screens/Messages/MessagesSearch';
import MessagesCreate from './app/screens/Messages/MessagesCreate';
import MessagesConversation from './app/screens/Messages/MessagesConversation';

const ConnectedRouter = connect()(Router);
const store = createStore(appReducer, applyMiddleware(thunk));

/* eslint-disable */
const Scenes = Actions.create(
  <Scene key="root">
    <Scene key="home" component={Home} hideNavBar />
    <Scene key="nearby" component={Nearby} />
    <Scene key="profile" component={Profile} />
    <Scene key="messages" navBar={MessagesNavBar}>
      <Scene key="messages_list" component={Messages} />
      <Scene key="messages_create" component={MessagesCreate} />
      <Scene key="messages_conversation" component={MessagesConversation} />
      <Scene key="messages_search" component={MessagesSearch} />
    </Scene>
    <Scene key="events" component={Events} />
    <Scene key="music"component={Music} />
    <Scene key="recorder"component={AudioRecorder} />
  </Scene>,
);
/* eslint-enable */

export default class NoteableMobile extends Component {
  componentDidMount() {
    store.dispatch(getAlreadySignedInUser());
    Answers.logCustom('Opened App');
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter scenes={Scenes} />
      </Provider>
    );
  }
}