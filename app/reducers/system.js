import {
  AccountActionTypes,
  RecordingActionTypes,
  SystemMessageActionTypes,
  SystemActionTypes,
} from '../actions/ActionTypes';

const {
  fetchSignInTypes,
  loginFacebookTypes,
  logoutTypes,
  registerUserTypes,
} = AccountActionTypes;

const {
  downloadRecordingTypes,
  syncDownRecordingsTypes,
  updateRecordingTypes,
  uploadRecordingTypes,
} = RecordingActionTypes;

const {
  networkingFailureType,
} = SystemMessageActionTypes;

const {
  alertType,
  queueNetworkRequestType,
  networkPreferencesFailureType,
  networkChangeType,
} = SystemActionTypes;

export default (state = { systemMessage: {}, authMessage: {}, network: { connected: '', queued: {} } }, action) => {
  const { type } = action;
  switch (type) {
    case alertType:
      return {
        ...state,
        systemMessage: {
          message: action.message,
          kind: action.kind,
        },
      };
    case logoutTypes.success:
      return {
        ...state,
        systemMessage: {
          message: 'Successfully logged out. Removing synced data.',
          kind: 'success',
        },
      };
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
    case loginFacebookTypes.processing:
      return {
        ...state,
        authMessage: {
          message: 'Logging in.',
          kind: 'success',
        },
      };
    case loginFacebookTypes.error:
      return {
        ...state,
        authMessage: {
          message: 'An error occurred logging in with Facebook.',
        },
      };
    case fetchSignInTypes.processing:
      return {
        ...state,
        authMessage: {
          message: 'Logging in.',
          kind: 'success',
        },
      };
    case fetchSignInTypes.error:
      return {
        ...state,
        authMessage: {
          message: 'Failed to log in with this email.',
          kind: 'error',
        },
      };
    case registerUserTypes.processing:
      return {
        ...state,
        authMessage: {
          message: 'Registering user.',
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
