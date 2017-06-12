import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Answers } from 'react-native-fabric';
import { StackNavigator } from 'react-navigation';
import { appReducer } from './app/reducers';
import { getAlreadySignedInUser } from './app/actions/accountActions';
import { appScreens } from './screens';

const store = createStore(appReducer, applyMiddleware(thunk));

const AppNavigator = StackNavigator(appScreens, { navigationOptions: { header: null } });

export default class NoteableMobile extends Component {
  componentDidMount() {
    store.dispatch(getAlreadySignedInUser());
    Answers.logCustom('Opened App');
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <AppNavigator />
        </View>
      </Provider>
    );
  }
}
