import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Answers } from 'react-native-fabric';
import { NativeRouter, Route } from 'react-router-native';
import createMemoryHistory from 'history/createMemoryHistory';


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
const history = createMemoryHistory();

export default class NoteableMobile extends Component {
  componentDidMount() {
    store.dispatch(getAlreadySignedInUser());
    Answers.logCustom('Opened App');
  }

  render() {
    return (
      <Provider store={store}>
        <NativeRouter history={history}>
          <View style={{ flex: 1, marginTop: 20 }}>
            <Route exact path="/" component={Home} />
            <Route path="/recordings" component={Music} />
            <Route path="/profile" component={Profile} />
          </View>
        </NativeRouter>
      </Provider>
    );
  }
}
