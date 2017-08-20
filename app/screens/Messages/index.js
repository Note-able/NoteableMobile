import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { sendMessage, getConversations, openConversation } from '../../actions/messageActions';
import Conversations from '../../components/Shared/Conversations';


const mapStateToProps = state => ({
  conversation: state.messagesReducer.selectedConversationId,
  user: state.Users.user,
  conversations: state.messagesReducer.conversations,
});

const mapDispatchToProps = dispatch => ({
  onSendMessage: (user, conversationId, content) => { dispatch(sendMessage(user, conversationId, content)); },
  onOpenConversation: (currentUserId, userId, conversationId) => { dispatch(openConversation(currentUserId, userId, conversationId)); },
  onGetConversations: (user) => { dispatch(getConversations(user)); },
});

class Messages extends PureComponent {
  componentDidMount() {
    this.props.onGetConversations(this.props.user);
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 45 }}>
        <Conversations {...this.props} />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
