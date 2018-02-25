import React from 'react';
import { Modal, StyleSheet } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';

const SignInModal = ({ onSuccess, close, visible }) => (
  <Modal onRequestClose={close} visible={visible} style={styles.signInModal}>
    <LoginButton
      publishPermissions={['publish_actions']}
      onLoginFinished={(error, result) => {
        if (error) {
          alert('Login failed with error: ' + result.error);
        } else if (result.isCancelled) {
          alert('Login was cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            onSuccess(data.accessToken.toString());
          });
        }
      }}
      onLogoutFinished={() => alert('User logged out')}
    />
  </Modal>
);

const styles = {
  modal: {
    ...StyleSheet.absoluteFillObject,
  },
  signInModal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default SignInModal;
