import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Answers } from 'react-native-fabric';
import { Navigation } from 'react-native-navigation';

import registerScreens from './screens';
import { appReducer } from './app/reducers';
import { getAlreadySignedInUser } from './app/actions/accountActions';


const store = createStore(appReducer, applyMiddleware(thunk));

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
