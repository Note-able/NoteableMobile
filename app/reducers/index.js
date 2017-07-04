import { combineReducers } from 'redux';
import { MapRecordingFromAPI, MapRecordingFromDB, MergeRecordings } from '../mappers/recordingMapper';
import {
  AccountActionTypes,
  PlayerActionTypes,
  RecordingActionTypes,
  SystemMessageActionTypes,
} from '../actions/ActionTypes';
import { logErrorToCrashlytics } from '../util.js';

const {
  deleteRecordingTypes,
  fetchRecordingsTypes,
  saveRecordingsTypes,
  syncDownRecordingsTypes,
  updateRecordingTypes,
  uploadRecordingTypes,
} = RecordingActionTypes;

const {
  startPlayerTypes,
} = PlayerActionTypes;

const {
  fetchSignInTypes,
  getCurrentUserTypes,
  loginFacebookTypes,
  logoutTypes,
  registerUserTypes,
} = AccountActionTypes;

const {
  networkingFailureType,
} = SystemMessageActionTypes;

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
    case syncDownRecordingsTypes.success:
      return {
        ...state,
        recordings: MergeRecordings(state.recordings, recordings.map(x => MapRecordingFromAPI(x))),
        processing: false,
      };
    case saveRecordingsTypes.success:
    case fetchRecordingsTypes.success:
    case 'RECORDING_SYNCED':
      return { ...state, recordings: recordings.map(x => MapRecordingFromDB(x)), processing: false, search: action.search };
    case deleteRecordingTypes.error:
    case saveRecordingsTypes.error:
    case fetchRecordingsTypes.error:
      return { ...state, recordingsError: error, processing: false };
    case uploadRecordingTypes.success:
      return {
        ...state,
        recordings: state.recordings.map((rec) => {
          if (rec.id === action.recording.id) {
            return action.recording;
          }
          return rec;
        }),
      };
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

const Users = (state = { user: {} }, action) => {
  const { type, error, user, profile } = action;
  switch (type) {
    case fetchSignInTypes.processing:
    case getCurrentUserTypes.processing:
    case registerUserTypes.processing:
    case logoutTypes.processing:
      return { ...state, isProcessing: true };
    case logoutTypes.success:
      return {
        ...state,
        user: null,
        isProcessing: false,
      };
    case getCurrentUserTypes.success:
      return {
        ...state,
        user: JSON.parse(action.currentUser),
        isProcessing: false,
      };
    case logoutTypes.error:
    case getCurrentUserTypes.error:
      return {
        ...state,
        isProcessing: false,
        error,
      };
    case loginFacebookTypes.success:
    case fetchSignInTypes.success:
      return {
        ...state,
        isProcessing: false,
        user,
      };
    case registerUserTypes.success:
      return {
        ...state,
        isProcessing: false,
        registration: action.registration,
      };
    case 'USER/SIGNIN':
      return { ...state, user };
    case 'USER/SIGNOUT':
      return { ...state, user: {} };
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

const SystemMessage = (state = {}, action) => {
  const { type } = action;
  switch (type) {
    case networkingFailureType:
      return {
        ...state,
        message: 'No internet connection',
        kind: 'error',
      };
    case syncDownRecordingsTypes.processing:
      return {
        ...state,
        message: 'Fetching recordings metadata',
        kind: 'success',
      };
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
  SystemMessage,
  Users,
});
