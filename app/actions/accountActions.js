import RNFetchBlob from 'react-native-fetch-blob';
import { AsyncStorage } from 'react-native';
import { AccountActionTypes } from './ActionTypes.js';
import { fetchUtil, getPreferences } from '../util';
import settings from '../settings.json';

const { apiBaseUrl, authBaseUrl } = settings;
const {
  getCurrentUserTypes,
  getUserPreferencesTypes,
  fetchSignInTypes,
  loadCurrentProfileTypes,
  logoutTypes,
  loginFacebookTypes,
  registerUserTypes,
  setUserPreferencesTypes,
  saveProfileTypes,
} = AccountActionTypes;

const USER = '@ACCOUNTS:CURRENT_USER';
const profileKey = '@PROFILE:CURRENT';

export const getCurrentUser = () => (
  async (dispatch) => {
    dispatch({ type: getCurrentUserTypes.processing });
    try {
      const currentUser = await AsyncStorage.getItem(USER);
      return dispatch({ type: getCurrentUserTypes.success, currentUser });
    } catch (error) {
      return dispatch({ type: getCurrentUserTypes.error, error: error.message });
    }
  }
);

export const loadCurrentProfile = () => (
  async (dispatch) => {
    dispatch({ type: loadCurrentProfileTypes.processing });
    let user = await AsyncStorage.getItem(USER);
    user = JSON.parse(user);

    if (user == null) {
      return dispatch({ type: loadCurrentProfileTypes.success });
    }

    try {
      const profile = await AsyncStorage.getItem(profileKey);
      if (profile != null) {
        return dispatch({ type: loadCurrentProfileTypes.success, profile: JSON.parse(profile) });
      }

      return fetchUtil.get({ url: `${apiBaseUrl}/users/${user.id}`, auth: user.jwt })
        .then((response) => {
          if (response.status < 200 || response.status >= 300) {
            if (response.statusText == null) {
              throw new Error('Failed to fetch profile.');
            }

            throw new Error(response.statusText);
          }

          return response.json();
        })
        .then(async (result) => {
          AsyncStorage.setItem(profileKey, JSON.stringify(result));
          return result;
        })
        .then((result) => {
          dispatch({ type: loadCurrentProfileTypes.success, profile: result });
        })
        .catch((error) => { throw error; });
    } catch (error) {
      return dispatch({ type: loadCurrentProfileTypes.error, error: error.message });
    }
  }
};

export const registerUser = registration => dispatch => {
  const { firstName, lastName, email, password } = registration;

  dispatch({ type: registerUserTypes.processing });

  return fetchUtil
    .postWithBody({ url: `${apiBaseUrl}/register`, body: { firstName, lastName, email, password } })
    .then(
    response => {
      if (response.status < 200 || response.status >= 300) {
        if (response.statusText == null) {
          throw new Error('Failed to register with a user with that email');
        }

        return response.json();
      }, error => dispatch({ type: registerUserTypes.error, error }))
    .then(() => {
      dispatch({ type: registerUserTypes.success, result: registration });
    }, error => dispatch({ type: registerUserTypes.error, error }));
}
);

export const loginFacebook = authToken => (
  (dispatch) => {
    if (authToken == null) {
      dispatch({ type: loginFacebookTypes.error, error: 'Access token missing.' });
    } else {
      dispatch({ type: loginFacebookTypes.processing });

      fetchUtil.postWithBody({ url: `${authBaseUrl}/auth/facebook/jwt`, body: { token: authToken } })
        .then(response => response.json())
        .then(async (result) => {
          const { token, user } = result;
          await AsyncStorage.setItem(USER, JSON.stringify({ ...user, jwt: token }));
          dispatch({ type: loginFacebookTypes.success, user });
        })
        .catch((error) => { dispatch({ type: loginFacebookTypes.error, error }); });
    }
  }
);

return response.json();
    },
error => dispatch({ type: registerUserTypes.error, error })
    )
    .then(
  result => {
    dispatch({ type: registerUserTypes.success, result });
  },
  error => dispatch({ type: registerUserTypes.error, error })
);
};

export const loginFacebook = authToken => dispatch => {
  if (authToken == null) {
    dispatch({ type: loginFacebookTypes.error, error: 'Access token missing.' });
  } else {
    dispatch({ type: loginFacebookTypes.processing });

    fetchUtil
      .postWithBody({ url: `${authBaseUrl}/auth/facebook/jwt`, body: { token: authToken } })
      .then(response => response.json())
      .then(result => {
        const { token, user } = result;
        AsyncStorage.setItem(USER, JSON.stringify({ ...user, jwt: token }));
        dispatch({ type: loginFacebookTypes.success, user });
      })
      .catch(error => {
        dispatch({ type: loginFacebookTypes.error, error });
      });
  }
};

export const signInLocal = (email, password) => dispatch => {
  dispatch({ type: fetchSignInTypes.processing });

  return fetchUtil
    .postWithBody({ url: `${authBaseUrl}/auth/local/jwt`, body: { username: email, password } })
    .then(
    response => {
      if (response.status < 200 || response.status >= 300) {
        throw new Error('Could not sign user in');
      }

      return response.json();
    },
    error => dispatch({ type: fetchSignInTypes.error, error })
    )
    .then(
    result => {
      const { token, user } = result;
      AsyncStorage.setItem(USER, JSON.stringify({ ...user, jwt: token }));
      dispatch({ type: fetchSignInTypes.success, user });
    },
    error => dispatch({ type: fetchSignInTypes.error, error })
    );
};

export const logout = () => async dispatch => {
  dispatch({ type: logoutTypes.processing });

  try {
    await AsyncStorage.removeItem(USER);
    dispatch({ type: logoutTypes.success });
  } catch (error) {
    dispatch({ type: logoutTypes.error, error });
  }
};

export const getUser = user => dispatch => {
  fetchCurrentProfile(user, profile => {
    dispatch({ type: 'USER/CURRENT_PROFILE', profile });
  });
};

export const getAlreadySignedInUser = () => async dispatch => {
  const user = await AsyncStorage.getItem(USER);
  if (user) {
    dispatch({ type: fetchSignInTypes.success, user: JSON.parse(user) });
  }
};

export const saveProfile = profile => (
  async (dispatch, getState) => {
    const { AccountReducer } = getState();

    if (profile.lastName === AccountReducer.profile.lastName &&
      profile.firstName === AccountReducer.profile.firstName &&
      profile.bio === AccountReducer.profile.bio &&
      profile.profileImage === AccountReducer.profile.avatarUrl
    ) {
      return null;
    }

    dispatch({ type: saveProfileTypes.processing });

    let avatarUrl = AccountReducer.profile.avatarUrl;
    if (profile.profileImage !== AccountReducer.profile.avatarUrl) {
      try {
        const response = await RNFetchBlob.fetch(
          'POST',
          `${apiBaseUrl}/users/edit/picture/new`,
          {
            Authorization: AccountReducer.user.jwt,
            'Content-Type': 'multipart/form-data',
          }, [{
            name: 'file',
            data: RNFetchBlob.wrap(profile.profileImage),
            filename: 'avatar-png.jpg',
          }]);

        if (response.respInfo.status < 200 || response.respInfo.status > 300) {
          return dispatch({ type: saveProfileTypes.error, error: response.respInfo.status });
        }

        avatarUrl = response.json().cloudStoragePublicUrl;
      } catch (error) {
        return dispatch({ type: saveProfileTypes.error, error: error.message });
      }
    }

    try {
      const response = await fetchUtil.postWithBody({
        url: `${apiBaseUrl}/users/${AccountReducer.user.id}/profile`,
        auth: AccountReducer.user.jwt,
        body: {
          ...AccountReducer.profile,
          ...profile,
          avatarUrl,
        },
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status < 200 || response.status > 300) {
        throw new Error('Update failed');
      }

      return dispatch({ type: saveProfileTypes.success, profile: { ...AccountReducer.profile, ...profile, avatarUrl } });
    } catch (error) {
      return dispatch({ type: saveProfileTypes.error, error: error.message });
    }
  }
);

const fetchCurrentProfile = (user, next) => {
  fetchUtil
    .get({
      url: `${authBaseUrl}/user/me`,
      auth: user.jwt,
    })
    .then(response => response.json())
    .then(profile => {
      next(profile);
    })
    .catch(error => console.warn(error));
};

const uploadPhoto = (imageUri, auth) => RNFetchBlob.fetch(
  'POST',
  `${apiBaseUrl}/users/edit/picture/new`,
  {
    Authorization: auth,
    'Content-Type': 'multipart/form-data',
  }, [{ name: 'file', data: RNFetchBlob.wrap(imageUri.replace('assets-library://', '')) }]);

/** **************** */
/** User Preferences */
/** **************** */
export const setUserPreferences = preferencePairs => async dispatch => {
  try {
    await AsyncStorage.multiSet(preferencePairs);
    dispatch({ type: setUserPreferencesTypes.success });
  } catch (error) {
    dispatch({ type: setUserPreferencesTypes.error, error });
  }
};

export const getUserPreferences = () => async dispatch => {
  try {
    const preferences = await getPreferences();
    dispatch({ type: getUserPreferencesTypes.success, preferences });
  } catch (error) {
    dispatch({ type: getUserPreferencesTypes.error, error });
  }
};
