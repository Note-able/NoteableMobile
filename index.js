import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Answers } from 'react-native-fabric';
import { StackNavigator } from 'react-navigation';
import { appReducer } from './app/reducers';
import { getAlreadySignedInUser } from './app/actions/accountActions';
import { appScreens } from './screens';

console.disableYellowBox = true;
const store = createStore(appReducer, applyMiddleware(thunk));

const AppNavigator = StackNavigator(appScreens, {
  initialRouteName: 'Home',
  navigationOptions: { header: null },
});

export default class NoteableMobile extends Component {
  componentDidMount() {
    store.dispatch(getAlreadySignedInUser());
    Answers.logCustom('Opened App');
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <StatusBar
            backgroundColor="black"
            barStyle="light-content"
          />
          <AppNavigator />
        </View>
      </Provider>
    );
  }
}
