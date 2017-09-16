/** eslint-disable no-duplicate-case */
import { combineReducers } from 'redux';
import RecordingsReducer from './recordings';
import PlayerReducer from './player';
import SystemReducer from './system';
import AccountReducer from './account';

const profileReducer = (state = { showPlayer: false }, { type }) => {
  switch (type) {
    case 'INITIALIZE_PLAYER':
      return { ...state, showPlayer: true };
    default:
      return { ...state };
  }
};

const DEFAULT_MESSAGES_STATE = {
  nav: {
    list: true,
  },
};

const messagesReducer = (state = DEFAULT_MESSAGES_STATE, { type, conversation, userName, conversations, message }) => {
  switch (type) {
    case 'HEADER_SEARCH':
      return { ...state, nav: { search: true } };
    case 'HEADER_LIST':
      return { ...state, nav: { list: true } };
    case 'MESSAGES/OPEN_CONVERSATION':
      conversations = { ...state.conversations };
      conversations[conversation.id].messages = conversation.messages;
      return { ...state, nav: { conversation: true, name: userName }, conversations, selectedConversationId: conversation.id };
    case 'MESSAGES/GET_CONVERSATIONS':
      return { ...state, conversations };
    case 'MESSAGES/SEND_MESSAGE':
      conversations = { ...state.conversations };
      conversation = { ...conversations[state.selectedConversationId] };
      conversation.messages.push(message);
      conversations[conversation.id] = conversation;
      return { ...state, conversations };
    default:
      return state;
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
  messagesReducer,
  newsFeedReducer,
  eventsReducer,
  SystemReducer,
});

/** eslint-enable */
