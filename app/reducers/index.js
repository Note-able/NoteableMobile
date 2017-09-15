/** eslint-disable no-duplicate-case */
import { combineReducers } from 'redux';
import {
  AccountActionTypes,
  PlayerActionTypes,
  RecordingActionTypes,
  SystemMessageActionTypes,
  SystemActionTypes,
} from '../actions/ActionTypes';
import { logErrorToCrashlytics, logCustomToFabric } from '../util.js';

const {
  deleteRecordingTypes,
  downloadRecordingTypes,
  fetchRecordingsTypes,
  logoutRecordingType,
  removeRecordingErrorType,
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
  getUserPreferencesTypes,
  loginFacebookTypes,
  logoutTypes,
  registerUserTypes,
} = AccountActionTypes;

const {
  networkingFailureType,
} = SystemMessageActionTypes;

const {
  queueNetworkRequestType,
  networkPreferencesFailureType,
  networkChangeType,
} = SystemActionTypes;

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
    case saveRecordingsTypes.success:
      logCustomToFabric('Recording Created');
      break;
    case deleteRecordingTypes.success:
      logCustomToFabric('Delete Recording');
      break;
    case uploadRecordingTypes.success:
      logCustomToFabric('Upload Recordings');
      break;
    case downloadRecordingTypes.success:
      logCustomToFabric('Download Recording');
      break;
    case syncDownRecordingsTypes.success:
      logCustomToFabric('Sync Down Recordings');
      break;
    case saveRecordingsTypes.error:
      logErrorToCrashlytics({ customMessage: 'Save Recordings Error', error });
      break;
    case deleteRecordingTypes.error:
      logErrorToCrashlytics({ customMessage: 'Delete Recordings Error', error });
      break;
    case uploadRecordingTypes.error:
      logErrorToCrashlytics({ customMessage: 'Upload Recordings Error', error });
      break;
    case downloadRecordingTypes.error:
      logErrorToCrashlytics({ customMessage: 'Download Recordings Error', error });
      break;
    case syncDownRecordingsTypes.error:
      logErrorToCrashlytics({ customMessage: 'Sync Recordings Error', error });
      break;
    case removeRecordingErrorType:
      logErrorToCrashlytics({ customMessage: 'Remove Recording Error', error });
      break;
    default:
      break;
  }

  switch (type) {
    case saveRecordingsTypes.error:
    case fetchRecordingsTypes.error:
    case deleteRecordingTypes.error:
    case updateRecordingTypes.error:
    case uploadRecordingTypes.error:
    case downloadRecordingTypes.error:
    case syncDownRecordingsTypes.error:
      return { ...state, error, processing: false };
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
    case saveRecordingsTypes.processing:
    case updateRecordingTypes.processing:
    case fetchRecordingsTypes.processing:
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
    case loginFacebookTypes.success:
      logCustomToFabric('Facebook Login');
      break;
    case logoutTypes.success:
      logCustomToFabric('Logout');
      break;
    case fetchSignInTypes.success:
      logCustomToFabric('Custom Login');
      break;
    case loginFacebookTypes.error:
      logErrorToCrashlytics({ customMessage: 'Facebook Login Error', error });
      break;
    case fetchSignInTypes.error:
      logErrorToCrashlytics({ customMessage: 'Custom Login Error', error });
      break;
    case logoutTypes.error:
      logErrorToCrashlytics({ customMessage: 'Logout Error', error });
      break;
    case registerUserTypes.error:
      logErrorToCrashlytics({ customMessage: 'Register Error', error });
      break;
    default:
      break;
  }

  switch (type) {
    case fetchSignInTypes.processing:
    case getCurrentUserTypes.processing:
    case registerUserTypes.processing:
    case logoutTypes.processing:
    case loginFacebookTypes.processing:
      return { ...state, isProcessing: true };
    case getUserPreferencesTypes.success:
      return {
        ...state,
        preferences: action.preferences,
      };
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
    case registerUserTypes.error:
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
    case fetchSignInTypes.error:
    case loginFacebookTypes.error:
      return {
        ...state,
        isProcessing: false,
        error,
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
      logCustomToFabric('Play Recording');
      break;
    default:
      break;
  }

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

const System = (state = { systemMessage: {}, authMessage: {}, network: { connected: '', queued: {} } }, action) => {
  const { type } = action;
  switch (type) {
    case networkPreferencesFailureType.cellular:
      return {
        ...state,
        systemMessage: {
          message: 'Cellular data not enabled',
          kind: 'error',
        },
      };
    case networkingFailureType:
      return {
        ...state,
        systemMessage: {
          message: 'No internet connection',
          kind: 'error',
        },
      };
    case syncDownRecordingsTypes.processing:
      return {
        ...state,
        systemMessage: {
          message: 'Syncing down',
          kind: 'success',
        },
      };
    case uploadRecordingTypes.processing:
      return {
        ...state,
        systemMessage: {
          message: 'Uploading',
          kind: 'success',
        },
      };
    case downloadRecordingTypes.processing:
      return {
        ...state,
        systemMessage: {
          message: 'Downloading',
          kind: 'success',
        },
      };
    case fetchSignInTypes.processing:
      return {
        ...state,
        authMessage: {
          message: 'Logging in',
          kind: 'success',
        },
      };
    case fetchSignInTypes.error:
      return {
        ...state,
        authMessage: {
          message: 'Failed to log in with this email',
          kind: 'error',
        },
      };
    case registerUserTypes.processing:
      return {
        ...state,
        authMessage: {
          message: 'Registering user',
          kind: 'success',
        },
      };
    case registerUserTypes.error:
      return {
        ...state,
        authMessage: {
          message: action.error.message,
          kind: 'error',
        },
      };
    case registerUserTypes.success:
    case fetchSignInTypes.success:
      return {
        ...state,
        authMessage: {
          message: 'Success',
          kind: 'success',
        },
      };
    case syncDownRecordingsTypes.success:
    case syncDownRecordingsTypes.error:
    case downloadRecordingTypes.success:
    case downloadRecordingTypes.error:
    case uploadRecordingTypes.error:
    case uploadRecordingTypes.success:
      return {
        ...state,
        systemMessage: {},
      };
    case networkChangeType:
      return {
        ...state,
        network: {
          connected: action.status,
        },
      };
    case queueNetworkRequestType:
      switch (action.request) {
        case updateRecordingTypes.queue:
          return {
            ...state,
            network: {
              ...state.network,
              queued: {
                ...state.network.queued,
                [updateRecordingTypes.queue]: {
                  [action.recording.id]: action.recording,
                },
              },
            },
          };
        case syncDownRecordingsTypes.queue:
          return {
            ...state,
            network: {
              ...state.network,
              queued: {
                ...state.network.queued,
              },
            },
          };
        default:
          return state;
      }
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
  System,
  Users,
});

/** eslint-enable */
