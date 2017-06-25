import { combineReducers } from 'redux';
import { MapRecordingFromDB } from '../mappers/recordingMapper';
import {
  AccountActionTypes,
  PlayerActionTypes,
  RecordingActionTypes,
} from '../actions/ActionTypes';
import { logErrorToCrashlytics } from '../util.js';

const {
  deleteRecordingTypes,
  fetchRecordingsTypes,
  saveRecordingsTypes,
  updateRecordingTypes,
} = RecordingActionTypes;

const {
  startPlayerTypes,
} = PlayerActionTypes;

const {
  getCurrentUserTypes,
  registerUserTypes,
} = AccountActionTypes;

const Recordings = (state = { recordings: [], shouldPlay: false }, action) => {
  const { type, recordings, audio, currentRecording, error } = action;
  const { shouldPlay } = state;
  switch (type) {
    case deleteRecordingTypes.success:
      return {
        ...state,
        recordings: state.recordings.filter(recording => recording.id !== action.id),
      };
    case updateRecordingTypes.success:
      return {
        ...state,
        recordings: state.recordings.map((recording) => {
          if (recording.id === action.record.id) {
            return MapRecordingFromDB(action.record);
          }
          return recording;
        }),
      };
    case saveRecordingsTypes.success:
    case fetchRecordingsTypes.success:
    case 'RECORDING_SYNCED':
      return { ...state, recordings: recordings.map(x => MapRecordingFromDB(x)), processing: false, search: action.search };
    case deleteRecordingTypes.error:
    case saveRecordingsTypes.error:
    case fetchRecordingsTypes.error:
      return { ...state, recordingsError: error, processing: false };
    case saveRecordingsTypes.processing:
    case fetchRecordingsTypes.processing:
      return { ...state, processing: true };
    case 'INITIALIZE_PLAYER':
      return { ...state, audio, currentRecording, shouldPlay: true };
    case 'TOGGLE_PLAY_FLAG':
      return { ...state, shouldPlay: !shouldPlay };
    default:
      return state;
  }
};

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

const Users = (state = {}, action) => {
  const { type, error, user, profile } = action;
  switch (type) {
    case getCurrentUserTypes.processing:
      return { ...state, isProcessing: true };
    case getCurrentUserTypes.success:
      return { ...state, currentUser: action.currentUser, isProcessing: false };
    case getCurrentUserTypes.error:
      return { ...state, isProcessing: false, error };
    case registerUserTypes.processing:
      return { ...state, isProcessing: true };
    case registerUserTypes.success:
      return {
        ...state,
        isProcessing: false,
        registration: action.registration,
      };
    case 'USER/SIGNIN':
      return { ...state, user };
    case 'USER/SIGNOUT':
      return { ...state, user: null };
    case 'USER/CURRENT_PROFILE':
      return { ...state, profile };
    default:
      return state;
  }
};

const Player = (state = { isPlaying: false, sound: null, recording: null }, action) => {
  const { type, error } = action;
  switch (type) {
    case startPlayerTypes.success:
      if (state.sound != null) {
        state.sound.stop();
        state.sound.release();
      }

      return {
        ...state,
        sound: action.sound,
        recording: action.recording,
      };
    case startPlayerTypes.error:
      logErrorToCrashlytics({ customMessage: 'starting player error: ', error });
      return state;
    default:
      return state;
  }
};

export const appReducer = combineReducers({
  Recordings,
  Player,
  profileReducer,
  messagesReducer,
  newsFeedReducer,
  eventsReducer,
  Users,
});
