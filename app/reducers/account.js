import { AccountActionTypes } from '../actions/ActionTypes';

import { logErrorToCrashlytics, logCustomToFabric } from '../util.js';

const {
  fetchSignInTypes,
  getCurrentUserTypes,
  getUserPreferencesTypes,
  loadCurrentProfileTypes,
  loadProfileTypes,
  loginFacebookTypes,
  logoutTypes,
  registerUserTypes,
  searchProfileTypes,
  saveProfileTypes,
} = AccountActionTypes;

const defaultState = {
  user: null,
  profile: null,
  search: {
    query: {},
    results: [],
  },
  isLoading: true,
};

export default (state = defaultState, action) => {
  const { type, error, user, result } = action;
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
    case loadCurrentProfileTypes.error:
      logErrorToCrashlytics({ customMessage: 'Load Profile', error });
      break;
    case saveProfileTypes.error:
      logErrorToCrashlytics({ customMessage: 'Save Profile', error });
      break;
    case searchProfileTypes.error:
      logErrorToCrashlytics({ customMessage: 'Search Profiles', error });
      break;
    case loadProfileTypes.error:
      logErrorToCrashlytics({ customMessage: 'Load User', error });
      break;
    default:
      break;
  }

  switch (type) {
    case fetchSignInTypes.processing:
    case getCurrentUserTypes.processing:
    case registerUserTypes.processing:
    case loadProfileTypes.processing:
    case logoutTypes.processing:
    case loginFacebookTypes.processing:
    case searchProfileTypes.processing:
    case saveProfileTypes.processing:
    case loadCurrentProfileTypes.processing:
      return { ...state, done: false, isProcessing: true, isLoading: true };
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
    case saveProfileTypes.error:
    case loadProfileTypes.error:
    case searchProfileTypes.error:
    case loadCurrentProfileTypes.error:
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
        done: true,
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
        registration: result,
      };
    case saveProfileTypes.success:
    case loadCurrentProfileTypes.success:
      return {
        ...state,
        isProcessing: false,
        isLoading: false,
        profile: action.profile,
      };
    case searchProfileTypes.success:
      return {
        ...state,
        isProcessing: false,
        search: {
          results: action.profiles,
          query: action.text,
        },
      };
    case loadProfileTypes.success:
      return {
        ...state,
        isProcessing: false,
        visibleProfile: action.profile,
      };
    default:
      return state;
  }
};
