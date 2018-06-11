import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { getConversations, openConversation, sendMessage } from '../../actions/messagesActions';

const mapStateToProps = (state) => {
  return ({
    selectedConversationId: state.MessagesReducer.selectedConversationId,
    user: state.AccountReducer.user,
    conversations: state.MessagesReducer.conversations,
  });
};

const mapDispatchToProps = dispatch => ({
  onSendMessage: (user, conversationId, content) => { dispatch(sendMessage(user, conversationId, content)); },
  onOpenConversation: (currentUser, conversationId) => { dispatch(openConversation(currentUser, conversationId)); },
  loadConversations: (user) => { dispatch(getConversations(user)); },
});

class Messages extends Component {
  static propTypes = {
    loadConversations: PropTypes.func.isRequired,
    onSendMessage: PropTypes.func.isRequired,
    onOpenConversation: PropTypes.func.isRequired,
    conversations: PropTypes.arrayOf(PropTypes.shape({
      conversationId: PropTypes.number.isRequired,
      users: PropTypes.arrayOf(PropTypes.object).isRequired,
      lastMessage: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
        userId: PropTypes.number.isRequired,
        timeStamp: PropTypes.string.isRequired,
      })),
    })),
    selectedConversationId: PropTypes.number,
    user: PropTypes.object,
  }

  componentDidMount() {
    this.loadConversations();
  }

  loadConversations = () => {
    this.props.loadConversations(this.props.user);
    setTimeout(this.loadConversations, 5000);
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
