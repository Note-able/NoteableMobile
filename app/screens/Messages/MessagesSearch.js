import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { openConversation } from '../../actions/messagesActions';
import UserSearch from '../../components/UserSearch';

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  openConversation: (currentUserId, userId, conversationId) => { dispatch(openConversation(currentUserId, userId, conversationId)); },
});

class MessagesSearch extends Component {
  state = {
    userId: 123,
  }

  onSelectUser = (id) => {
    const { openConversation } = this.props;
    openConversation(this.state.userId, id);
    // Actions.messages_conversation();
  }

  render() {
    return (
      <View style={styles.container}>
        <UserSearch users={users} handleUserPress={this.onSelectUser} />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesSearch);

const styles = {
  container: {
    flex: 1,
    marginTop: 45,
  },
};

const users = {
  123: {
    id: 123,
    name: 'Ian Mundy',
    profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
  },
  234: {
    id: 234,
    name: 'Sportnak',
    profileImage: 'https://avatars.logoscdn.com/2383/5112383_large_1aed4286212c43a9ae74010dbc9a7be0.jpg',
  },
};
