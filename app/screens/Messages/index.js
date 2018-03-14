import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { getConversations, openConversation, sendMessage } from '../../actions/messagesActions';

const mapStateToProps = state => ({
  selectedConversationId: state.messagesReducer.selectedConversationId,
  user: state.Users.user,
  conversations: state.messagesReducer.conversations,
});

const mapDispatchToProps = dispatch => ({
  onSendMessage: (user, conversationId, content) => { dispatch(sendMessage(user, conversationId, content)); },
  onOpenConversation: (currentUser, conversationId) => { dispatch(openConversation(currentUser, conversationId)); },
  onGetConversations: (user) => { dispatch(getConversations(user)); },
});

class Messages extends Component {
  componentDidMount() {
    this.props.onGetConversations(this.props.user);
  }

  render() {
    const { conversations, selectedConversationId, user, onOpenConversation } = this.props;
    if (selectedConversationId) {
      const conversation = conversation[selectedConversationId];
      return (
        <View>
          {conversation.messages.map(message => (
            <View>
              <Text>{message.userId}</Text>
              <Text>{message.content}</Text>
            </View>
          ))}
        </View>
      );
    }

    return (
      <View>
        {Object.keys(conversations).map(cid => (<TouchableOpacity key={cid} onPress={onOpenConversation(user, cid)}>
          <Text>{cid}</Text>
        </TouchableOpacity>))}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
