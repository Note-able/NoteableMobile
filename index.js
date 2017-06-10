import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Answers } from 'react-native-fabric';
import { Navigation } from 'react-native-navigation';

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

const store = createStore(appReducer, applyMiddleware(thunk));

const registerScreens = (store, Provider) => {
  Navigation.registerComponent('Home', () => Home, store, Provider);
  Navigation.registerComponent('Recordings', () => Music, store, Provider);
  Navigation.registerComponent('Profile', () => Profile, store, Provider);
};

registerScreens(store, Provider);

export default class NoteableMobile extends Component {
  constructor(props) {
    super(props);

    store.dispatch(getAlreadySignedInUser());
    Answers.logCustom('Opened App');
  }

  startApp() {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'Home', // unique ID registered with Navigation.registerScreen
        title: 'Noteable', // title of the screen as appears in the nav bar (optional)
        navigatorStyle: { navBarHidden: true },
      },
    });
  }
}
