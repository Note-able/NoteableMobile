import { AsyncStorage } from 'react-native';
import { AccountActionTypes } from './ActionTypes.js';
import { fetchUtil, getPreferences } from '../util';

const {
  getCurrentUserTypes,
  getUserPreferencesTypes,
  fetchSignInTypes,
  logoutTypes,
  loginFacebookTypes,
  registerUserTypes,
  setUserPreferencesTypes,
} = AccountActionTypes;

const USER = '@ACCOUNTS:CURRENT_USER';

export const getCurrentUser = () => (
  async (dispatch) => {
    dispatch({ type: getCurrentUserTypes.processing });
    try {
      const currentUser = await AsyncStorage.getItem(USER);
      dispatch({ type: getCurrentUserTypes.success, currentUser });
    } catch (error) {
      dispatch({ type: getCurrentUserTypes.error, error });
    }
  }
);

export const registerUser = registration => (
  (dispatch) => {
    const { firstName, lastName, email, password } = registration;

    dispatch({ type: registerUserTypes.processing });

    fetchUtil.postWithBody({ url: 'https://beta.noteable.me/api/v1/register', body: { firstName, lastName, email, password } })
      .then((response) => {
        if (response.status !== 200) {
          if (response.statusText == null) {
            throw new Error('Failed to register with a user with that email');
          }
        }

        return response.json();
      }, error => dispatch({ type: registerUserTypes.error, error }))
      .then((result) => {
        dispatch({ type: registerUserTypes.success, registration, result });
      }, error => dispatch({ type: registerUserTypes.error, error }));
  }
);

export const loginFacebook = authToken => (
  (dispatch) => {
    if (authToken == null) {
      dispatch({ type: loginFacebookTypes.error, error: 'Access token missing.' });
    } else {
      dispatch({ type: loginFacebookTypes.processing });

      fetchUtil.postWithBody({ url: 'https://beta.noteable.me/auth/facebook/jwt', body: { token: authToken } })
      .then((response) => {
        if (response.status !== 200) {
          if (response.statusText == null) {
            throw new Error('Could not sign user in');
          }
        }

        return response.json();
      })
      .then((result) => {
        const { token, user } = result;
        AsyncStorage.setItem(USER, JSON.stringify({ ...user, jwt: token }));
        dispatch({ type: loginFacebookTypes.success, user });
      })
      .catch((error) => { dispatch({ type: loginFacebookTypes.error, error }); });
    }
  }
);

export const signInLocal = (email, password) => (
  (dispatch) => {
    dispatch({ type: fetchSignInTypes.processing });

    fetchUtil.postWithBody({ url: 'https://beta.noteable.me/auth/local/jwt', body: { username: email, password } })
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Could not sign user in');
        }

        return response.json();
      }, error => dispatch({ type: registerUserTypes.error, error }))
      .then((result) => {
        console.log(result);
        const { token, user } = result;
        AsyncStorage.setItem(USER, JSON.stringify({ ...user, jwt: token }));
        dispatch({ type: fetchSignInTypes.success, user });
      }, error => dispatch({ type: registerUserTypes.error, error }));
  }
);

export const logout = () => (
  async (dispatch) => {
    dispatch({ type: logoutTypes.processing });

    try {
      await AsyncStorage.removeItem(USER);
      dispatch({ type: logoutTypes.success });
    } catch (error) {
      dispatch({ type: logoutTypes.error, error });
    }
  }
);

export const getUser = user => (
  (dispatch) => {
    fetchCurrentProfile(user, (profile) => {
      dispatch({ type: 'USER/CURRENT_PROFILE', profile });
    });
  }
);

export const onSignIn = token => (
  async function (dispatch) {
    const currentUser = await AsyncStorage.getItem(USER);
    if (!currentUser) {
      signIn(token, (user) => { dispatch({ type: 'USER/SIGNIN', user }); });
    } else {
      dispatch({ type: 'USER/SIGNIN', user: JSON.parse(currentUser) });
    }
  }
);

export const getAlreadySignedInUser = () => (
  async function (dispatch) {
    const user = await AsyncStorage.getItem(USER);
    if (user) {
      dispatch({ type: 'USER/SIGNIN', user: JSON.parse(user) });
    }
  }
);

export const onSignOut = () => (
  (dispatch) => {
    AsyncStorage.setItem(USER, null);
    dispatch({ type: 'USER/SIGNOUT' });
  }
);

const signIn = (token, next) => {
  fetchUtil.postWithBody({
    url: 'https://beta.noteable.me/auth/jwt',
    body: {
      token,
    },
  })
  .then(response => response.json())
  .then((json) => {
    const { t, user } = json;
    user.jwt = t;
    AsyncStorage.setItem(USER, JSON.stringify(user));
    next(user);
  })
  .catch(error => console.warn(error));
};

const fetchCurrentProfile = (user, next) => {
  fetchUtil.get({
    url: 'https://beta.noteable.me/user/me',
    auth: user.jwt,
  })
  .then(response => response.json())
  .then((profile) => {
    next(profile);
  })
  .catch(error => console.warn(error));
};

/** **************** */
/** User Preferences */
/** **************** */
export const setUserPreferences = preferencePairs => (
  async (dispatch) => {
    try {
      await AsyncStorage.multiSet(preferencePairs);
      dispatch({ type: setUserPreferencesTypes.success });
    } catch (error) {
      dispatch({ type: setUserPreferencesTypes.error, error });
    }
  }
);

export const getUserPreferences = () => (
  async (dispatch) => {
    try {
      const preferences = await getPreferences();
      dispatch({ type: getUserPreferencesTypes.success, preferences });
    } catch (error) {
      dispatch({ type: getUserPreferencesTypes.error, error });
    }
  }
);
