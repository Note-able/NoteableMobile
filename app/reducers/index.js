/** eslint-disable no-duplicate-case */
import { combineReducers } from 'redux';
import { MergeRecordings } from '../mappers/recordingMapper';
import {
  AccountActionTypes,
  PlayerActionTypes,
  RecordingActionTypes,
  SystemMessageActionTypes,
  MessageActionTypes,
} from '../actions/ActionTypes';
import { logErrorToCrashlytics } from '../util.js';

const {
  deleteRecordingTypes,
  downloadRecordingTypes,
  fetchRecordingsTypes,
  logoutRecordingType,
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

const {
  getConversations,
  openConversation,
  sendMessage,
  searchMessages,
  listMessages,
} = MessageActionTypes;

const DEFAULT_RECORDINGS_STATE = {
  recordings: {
    local: {},
    networked: {},
    order: [],
  },
  processing: false,
  search: '',
};

const Recordings = (state = DEFAULT_RECORDINGS_STATE, action) => {
  const { type, error } = action;
  switch (type) {
    case saveRecordingsTypes.error:
    case fetchRecordingsTypes.error:
    case deleteRecordingTypes.error:
    case updateRecordingTypes.error:
    case uploadRecordingTypes.error:
    case downloadRecordingTypes.error:
    case syncDownRecordingsTypes.error:
      console.log(type, error || 'failure');
      logErrorToCrashlytics(error || 'failure');
      return { ...state, error, processing: false };
    // eslint-disable no-fallthrough
    case saveRecordingsTypes.success:
    case logoutRecordingType:
    case fetchRecordingsTypes.success:
      return {
        ...state,
        recordings: action.recordings,
        processing: false,
        search: action.search,
      };
    case deleteRecordingTypes.success:
      return {
        ...state,
        processing: false,
        recordings: {
          ...state.recordings,
          local: {
            ...state.recordings.local,
            [action.deletedId]: null,
          },
          networked: {
            ...state.recordings.networked,
            [action.deletedId]: null,
          },
          order: state.recordings.order.filter(x => x !== action.deletedId),
        },
      };
    case downloadRecordingTypes.success:
      return {
        ...state,
        processing: false,
        recordings: {
          ...state.recordings,
          local: state.recordings.local[action.record.id] != null ? {
            ...state.recordings.local,
            [action.record.id]: null,
          } : state.recordings.local,
          networked: {
            ...state.recordings.networked,
            [action.record.id]: action.record,
          },
        },
      };

    case updateRecordingTypes.success:
      return {
        ...state,
        processing: false,
        recordings: {
          ...state.recordings,
          local: state.recordings.local[action.record.id] == null ? state.recordings.local : {
            ...state.recordings.local,
            [action.record.id]: action.record,
          },
          networked: state.recordings.networked[action.record.resourceId] == null ? state.recordings.networked : {
            ...state.recordings.networked,
            [action.record.id]: action.record,
          },
        },
      };
    case syncDownRecordingsTypes.success:
      return {
        ...state,
        recordings: action.recordings,
        processing: false,
      };
    case uploadRecordingTypes.success:
      return {
        ...state,
        processing: false,
        recordings: {
          ...state.recordings,
          local: {
            ...state.recordings.local,
            [action.deletedId]: null,
          },
          networked: {
            ...state.recordings.networked,
            [action.recording.id]: action.recording,
          },
        },
      };
    case updateRecordingTypes.processing:
    case saveRecordingsTypes.processing:
    case fetchRecordingsTypes.processing:
    case uploadRecordingTypes.processing:
    case syncDownRecordingsTypes.processing:
      return { ...state, processing: true };
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

const messagesReducer = (state = DEFAULT_MESSAGES_STATE, { type, conversation, userName, conversations, message, error }) => {
  switch (type) {
    case openConversation.error:
    case getConversations.error:
    case sendMessage.error:
      console.log(type, error || 'failure');
      logErrorToCrashlytics(error || 'failure');
      return { ...state, isProcessing: false, error };
    case openConversation.processing:
    case getConversations.processing:
    case sendMessage.processing:
      return { ...state, isProcessing: true };
    case searchMessages:
      return { ...state, nav: { search: true } };
    case listMessages:
      return { ...state, nav: { list: true } };
    case openConversation.success:
      conversations = { ...state.conversations };
      conversations[conversation.id].messages = conversation.messages;
      return { ...state, nav: { conversation: true, name: userName }, conversations, selectedConversationId: conversation.id };
    case getConversations.success:
      return { ...state, conversations };
    case sendMessage.success:
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

/** eslint-enable */
