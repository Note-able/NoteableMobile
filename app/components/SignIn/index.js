import React, { Component } from 'react';
import { View, TouchableHighlight, Text, Modal, StyleSheet } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { connect } from 'react-redux';

import { onSignIn } from '../../actions/accountActions';

const mapDispatchToProps = dispatch => ({
  onSignIn: (result) => { dispatch(onSignIn(result)); },
});

class SignIn extends Component {
  state ={
    modalVisible: false,
  }

  showModal = () => {
    this.setState({ modalVisible: true });
  }

  hideModal = () => {
    this.setState({ modalVisible: false });
  }

  render() {
    return (
      <View>
        <TouchableHighlight style={{ flex: 1 }} onPress={this.showModal}>
          <Text style={{ flex: 1, color: 'white' }}>Sign In</Text>
        </TouchableHighlight>
        <SignInModal onSuccess={this.props.onSignIn} close={this.hideModal} visible={this.state.modalVisible} />
      </View>
    );
  }
}

export default connect(null, mapDispatchToProps)(SignIn);

const SignInModal = ({ onSuccess, close, visible }) => (
  <Modal
    onRequestClose={close}
    visible={visible}
    style={styles.signInModal}
  >
    <LoginButton
      publishPermissions={["publish_actions"]}
      onLoginFinished={
        (error, result) => {
          if (error) {
            alert('Login failed with error: ' + result.error);
          } else if (result.isCancelled) {
            alert('Login was cancelled');
          } else {
            AccessToken.getCurrentAccessToken().then((data) => { onSuccess(data.accessToken.toString()); });
          }
        }
      }
      onLogoutFinished={() => alert('User logged out')}
    />
  </Modal>);

const styles = {
  modal: {
    ...StyleSheet.absoluteFillObject,
  },
  signInModal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
};
