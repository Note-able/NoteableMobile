import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { sendMessage } from '../../actions/messagesActions';

import Conversation from '../../components/MessageList/Conversation';

const mapStateToProps = state => ({
  conversation: state.messagesReducer.conversations[state.messagesReducer.selectedConversationId],
  user: state.userReducer.user,
});

const mapDispatchToProps = dispatch => ({
  sendMessage: (user, conversationId, content) => { dispatch(sendMessage(user, conversationId, content)); },
});

class Messages extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Conversation {...this.props} />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);

const styles = {
  container: {
    flex: 1,
    marginTop: 65,
    overflow: 'visible',
  },
};
