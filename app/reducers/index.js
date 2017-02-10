import { ActionConst, Actions } from 'react-native-router-flux'
import { combineReducers } from 'redux';

const DEFAULT_STATE = {scene: {}};
const sceneReducer = (state = DEFAULT_STATE, {type, scene}) => {
  switch(type) {
    // focus action is dispatched when a new screen comes into focus
    case ActionConst.FOCUS:
      return {
        ...state,
        scene,
      }
    default:
      return state
  }
};

const recordingsReducer = (state = { recordings: [], shouldPlay: false }, {type, recordings, audio, currentRecording}) => {
    switch(type) {
        case 'GET_RECORDINGS':
            return { ...state, recordings };
        case 'INITIALIZE_PLAYER':
            return { ...state, audio, currentRecording, shouldPlay: true };
        case 'TOGGLE_PLAY_FLAG':
            const { shouldPlay } = state;
            return { ...state, shouldPlay: !shouldPlay };
        default:
            return state;
    } 
};

const profileReducer = (state = { showPlayer: false }, {type}) => {
    switch(type) {
        case 'INITIALIZE_PLAYER':
            return { ...state, showPlayer: true };
        default:
            return { ...state };
    }  
};

const DEFAULT_MESSAGES_STATE = {
    nav: {
        list: true,
    }
}
const messagesReducer = (state = DEFAULT_MESSAGES_STATE, {type, conversation, userName, conversations, message}) => {
    switch(type) {
        case 'HEADER_SEARCH':
            return { ...state, nav: { search: true} };
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
}

const newsFeedReducer = (state = {events: []}, {type, events}) => {
    switch(type) {
        case 'GET_NEARBY': 
            return { ...state, events };
        default:
            return state;
    }
}

const defaultRegion = {
    latitude: 48.7153382,
    longitude: -122.34007580000002,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}
const eventsReducer = (state = {location: defaultRegion, events: []}, {type, events}) => {
    switch(type) {
        case 'CHANGE_LOCATION':
            return state;
        case 'GET_EVENTS':
            return { ...state, events };
        default:
            return state;
    }
}

const userReducer = (state = {}, {type, user, profile}) => {
    switch(type) {
        case 'USER/SIGNIN':
            return {...state, user };
        case 'USER/SIGNOUT':
            return { ...state, user: null };
        case 'USER/CURRENT_PROFILE':
            return { ...state, profile };
        default:
            return state;
    }
}

export const appReducer = combineReducers({
    sceneReducer,
    recordingsReducer,
    profileReducer,
    messagesReducer,
    newsFeedReducer,
    eventsReducer,
    userReducer,
});
