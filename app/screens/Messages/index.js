import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { getConversations, openConversation, sendMessage } from '../../actions/messagesActions';

const mapStateToProps = state => ({
  selectedConversationId: state.MessagesReducer.selectedConversationId,
  user: state.AccountReducer.user,
  conversations: state.MessagesReducer.conversations,
});

const mapDispatchToProps = dispatch => ({
  onSendMessage: (user, conversationId, content) => {
    dispatch(sendMessage(user, conversationId, content));
  },
  onOpenConversation: (currentUser, conversationId) => {
    dispatch(openConversation(currentUser, conversationId));
  },
  loadConversations: user => dispatch(getConversations(user)),
});

class Messages extends Component {
  static propTypes = {
    loadConversations: PropTypes.func.isRequired,
    onSendMessage: PropTypes.func.isRequired,
    onOpenConversation: PropTypes.func.isRequired,
    conversations: PropTypes.shape({}),
    /*
      conversation shape:
      PropTypes.shape({
        conversationId: PropTypes.number.isRequired,
        users: PropTypes.arrayOf(PropTypes.object).isRequired,
        lastMessage: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            content: PropTypes.string.isRequired,
            userId: PropTypes.number.isRequired,
            timeStamp: PropTypes.string.isRequired,
          }),
        ),
      }),
    */
    selectedConversationId: PropTypes.number,
    user: PropTypes.shape({}),
  };

  componentDidMount() {
    if (this.props.user) this.loadConversations();
  }

  componentDidUpdate() {
    if (this.props.user) this.loadConversations();
  }

  loadConversations = () => {
    if (!this._timeout) {
      this._timeout = setTimeout(() => {
        this._timeout = null;
        this.props.loadConversations(this.props.user);
      }, 1000);
    }
  };

  render() {
    const {
      conversations,
      selectedConversationId,
      user: currentUser,
      onOpenConversation,
    } = this.props;

    return (
      <View>
        <FlatList
          data={Object.keys(conversations).map(id => ({ key: id, ...conversations[id] }))}
          renderItem={({ item }) => {
            const { users, lastMessage } = item;
            const otherUser = Object.values(users).find(x => x.id !== currentUser.id);
            return (
              <TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    borderBottomColor: '#CCC',
                    borderBottomWidth: 1,
                    height: 50,
                  }}
                >
                  <Image
                    style={{ height: 20, width: 20, marginHorizontal: 10, marginVertical: 5 }}
                    source={
                      otherUser.avatarUrl && otherUser.avatarUrl.length > 0
                        ? { uri: otherUser.avatarUrl }
                        : require('../../img/profile_square_white.png')
                    }
                  />
                  <View style={{ height: 40, marginVertical: 5 }}>
                    <Text style={{ color: '#FFF' }}>
                      {moment(lastMessage.timeStamp).format('2013W065')}
                    </Text>
                    <Text style={{ color: '#FFF' }}>{lastMessage.content}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
