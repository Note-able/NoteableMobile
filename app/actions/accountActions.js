import { AsyncStorage } from 'react-native';
import { AccountActionTypes } from './ActionTypes.js';
import { fetchUtil, logErrorToCrashlytics } from '../util';

const {
  getCurrentUserTypes,
  fetchSignInTypes,
  registerUserTypes,
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

    fetch('http://beta.noteable.me/api/v1/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    }).then((response) => {
      if (response.status !== 200) {
        throw new Error(`Failed to register user: ${response.statusText}`);
      }

      return response.json();
    }, error => dispatch({ type: registerUserTypes.error, error }))
    .then((result) => {
      dispatch({ type: registerUserTypes.success, registration, result });
    });
  }
);

export const signInLocal = (email, password) => (
  (dispatch) => {
    dispatch({ type: fetchSignInTypes.processing });

    fetch('http://beta.noteable.me/auth/local/jwt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password }),
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
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
    url: 'http://beta.noteable.me/auth/jwt',
    body: {
      token,
    },
  })
  .then(response => response.json())
  .then((json) => {
    const { token, user } = json;
    user.jwt = token;
    AsyncStorage.setItem(USER, JSON.stringify(user));
    next(user);
  })
  .catch(error => logErrorToCrashlytics(error));
};

const fetchCurrentProfile = (user, next) => {
  fetchUtil.get({
    url: 'http://beta.noteable.me/user/me',
    auth: user.jwt,
  })
  .then(response => response.json())
  .then((profile) => {
    next(profile);
  })
  .catch(error => logErrorToCrashlytics(error));
};
