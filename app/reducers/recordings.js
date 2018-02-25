import { RecordingActionTypes } from '../actions/ActionTypes';

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

const DEFAULT_RECORDINGS_STATE = {
  recordings: {
    local: {},
    networked: {},
    order: [],
  },
  processing: false,
  search: '',
};

export default (state = DEFAULT_RECORDINGS_STATE, action) => {
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
      logErrorToCrashlytics({ customMessage: 'Save Recordings Error', message: { error, state } });
      break;
    case deleteRecordingTypes.error:
      logErrorToCrashlytics({
        customMessage: 'Delete Recordings Error',
        message: { error, state },
      });
      break;
    case uploadRecordingTypes.error:
      logErrorToCrashlytics({
        customMessage: 'Upload Recordings Error',
        message: { error, state },
      });
      break;
    case downloadRecordingTypes.error:
      logErrorToCrashlytics({
        customMessage: 'Download Recordings Error',
        message: { error, state },
      });
      break;
    case syncDownRecordingsTypes.error:
      logErrorToCrashlytics({ customMessage: 'Sync Recordings Error', message: { error, state } });
      break;
    case removeRecordingErrorType:
      logErrorToCrashlytics({ customMessage: 'Remove Recording Error', message: { error, state } });
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
          local:
            state.recordings.local[action.record.id] != null
              ? {
                  ...state.recordings.local,
                  [action.record.id]: null,
                }
              : state.recordings.local,
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
          local:
            state.recordings.local[action.record.id] == null
              ? state.recordings.local
              : {
                  ...state.recordings.local,
                  [action.record.id]: action.record,
                },
          networked:
            state.recordings.networked[action.record.resourceId] == null
              ? state.recordings.networked
              : {
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
