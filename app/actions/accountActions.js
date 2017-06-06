import { AsyncStorage } from 'react-native';

import { fetchUtil, logErrorToCrashlytics } from '../util';

const USER = '@ACCOUNTS:CURRENT_USER';

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
      signIn(token, (user) => { dispatch({ type: 'USER/SIGNIN', user }) });
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
  .then((response) => { return response.json(); })
  .then((json) => {
    const { token, user } = json;
    user.jwt = token;
    AsyncStorage.setItem(USER, JSON.stringify(user));
    next(user);
  })
  .catch(error => logErrorToCrashlytics(error));
};

const fetchCurrentProfile = (user, next) => {
  if (!user) {
    return;
  }

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
