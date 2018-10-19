/** eslint-disable no-duplicate-case */
import { combineReducers } from 'redux';
import RecordingsReducer from './recordings';
import PlayerReducer from './player';
import SystemReducer from './system';
import AccountReducer from './account';
import MessagesReducer from './messages';

const profileReducer = (state = { showPlayer: false }, { type }) => {
  switch (type) {
    case 'INITIALIZE_PLAYER':
      return { ...state, showPlayer: true };
    default:
      return { ...state };
  }
};

const newsFeedReducer = (state = { events: [] }, { type, events }) => {
  switch (type) {
    case 'GET_NEARBY':
      return { ...state, events };
    default:
      return state;
  }
};

const defaultRegion = {
  latitude: 48.7153382,
  longitude: -122.34007580000002,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const eventsReducer = (state = { location: defaultRegion, events: [] }, { type, events }) => {
  switch (type) {
    case 'CHANGE_LOCATION':
      return state;
    case 'GET_EVENTS':
      return { ...state, events };
    default:
      return state;
  }
};

export default combineReducers({
  AccountReducer,
  RecordingsReducer,
  PlayerReducer,
  profileReducer,
  newsFeedReducer,
  eventsReducer,
  SystemReducer,
  MessagesReducer,
});

/** eslint-enable */
