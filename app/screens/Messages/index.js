import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { getConversations as fetchConversations, openConversation } from '../../actions/messagesActions';
import MessageList from '../../components/MessageList';

const mapStateToProps = state => ({
  user: state.userReducer.user,
  conversations: state.messagesReducer.conversations,
});

const mapDispatchToProps = dispatch => ({
  openConversation: (currentUserId, userId, conversationId) => {dispatch(openConversation(currentUserId, userId, conversationId));},
  getConversations: (user) => { dispatch(fetchConversations(user)); },
});

class Messages extends Component {
  componentDidMount() {
    this.props.getConversations(this.props.user);
  }

  selectConversation = (conversationId, userId) => {
    const { openConversation, user } = this.props;
    openConversation(user, userId, conversationId);
    // Actions.messages_conversation();
  }

  render() {
    const { conversations = [], user } = this.props;
    return (
      <View style={styles.container}>
        <MessageList conversations={conversations} userId={user.id} onSelectConversation={this.selectConversation} />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);

const styles = {
  container: {
    flex: 1,
    marginTop: 45,
  },
};
