import { AsyncStorage } from 'react-native';

export const onSignIn = (token) => {
    return async function (dispatch) {
        const currentUser = await AsyncStorage.getItem(USER);
        if (!currentUser) {
            signIn(token, (user) => { dispatch({ type: 'USER/SIGNIN', user }) });
        } else {
            dispatch({ type: 'USER/SIGNIN', user: JSON.parse(currentUser) });
        }
    }
}

export const getAlreadySignedInUser = () => {
    return async function(dispatch) {
        const user = await AsyncStorage.getItem(USER);
        if (user)
            dispatch({ type: 'USER/SIGNIN', user: JSON.parse(user) });
    };
}

export const onSignOut = () => {
    return (dispatch) => {
        AsyncStorage.setItem(USER, null);
        dispatch({ type: 'USER/SIGNOUT' });
    }
}

const signIn = (token, next) => {
    fetch(`http://beta.noteable.me/auth/jwt`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token
        }),
    })
    .then((response) => { return response.json(); })
    .then((json) => {
        const { token, user } = json;
        user.jwt = token;
        AsyncStorage.setItem(USER, JSON.stringify(user));
        next(user);
    })
    .catch(error => console.warn(error));
}

const USER = '@ACCOUNTS:CURRENT_USER';