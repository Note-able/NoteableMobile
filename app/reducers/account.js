import {
  AccountActionTypes,
} from '../actions/ActionTypes';

import { logErrorToCrashlytics, logCustomToFabric } from '../util.js';

const {
  fetchSignInTypes,
  getCurrentUserTypes,
  getUserPreferencesTypes,
  loginFacebookTypes,
  logoutTypes,
  registerUserTypes,
} = AccountActionTypes;

export default (state = { user: {} }, action) => {
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
