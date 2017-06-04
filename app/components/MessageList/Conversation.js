import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, Image, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Conversation extends Component {
  state = {
    message: '',
  }

  render() {
    const { user, conversation, sendMessage } = this.props;
    if (!conversation) {
      return null;
    }

    return (
      <View style={styles.container}>
        <ScrollView>
          { conversation.messages.map((message, i) => {
            const differentUser = i === 0 || conversation.messages[i - 1].userId !== message.userId;
            return message.userId === user.id ?
              <CurrentUserMessage key={message.id} user={conversation.users[message.userId]} message={message.content} showProfileImage={differentUser} /> :
              <OtherMessage key={message.id} user={conversation.users[message.userId]} message={message.content} showProfileImage={differentUser} />;
          }) }
        </ScrollView>
        <View style={styles.sendContainer}>
          <TextInput style={styles.sendInput} onChangeText={text => this.setState({ message: text })} value={this.state.message} />
          <TouchableHighlight onPress={() => { sendMessage(user, conversation.id, this.state.message); }} >
            <Icon name="chat-bubble-outline" style={styles.sendButton} color="#3574DA" />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const OtherMessage = ({ user, message, showProfileImage }) => (
  <View style={showProfileImage ? styles.messageContainer : styles.otherUserMessageContainer}>
    { showProfileImage ?
      <Image source={{ uri: user.avatarUrl }} style={styles.messageImage} /> :
      null }
    <View style={[styles.messageContent, styles.otherMessage]}>
      <Text style={[styles.messageText, styles.otherText]}>{message}</Text>
    </View>
  </View>
);

const CurrentUserMessage = ({ user, message, showProfileImage }) => (
  <View style={showProfileImage ? styles.messageContainer : styles.currentUserMessageContainer}>
    <View style={[styles.messageContent, styles.currentUserMessage]}>
      <Text style={[styles.messageText, styles.currentUserText]}>{message}</Text>
    </View>
    { showProfileImage ?
      <Image source={{ uri: user.avatarUrl }} style={styles.messageImage} /> :
      null }
  </View>
);

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  sendContainer: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 50,
    borderTopWidth: 2,
    borderTopColor: '#3574DA',
  },
  sendButton: {
    height: 40,
    width: 40,
    fontSize: 40,
    marginHorizontal: 16,
  },
  sendInput: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'row',
  },
  otherUserMessageContainer: {
    flex: 1,
    marginLeft: 40,
    flexDirection: 'row',
  },
  currentUserMessageContainer: {
    flex: 1,
    marginRight: 40,
    flexDirection: 'row',
  },
  messageContent: {
    flex: 1,
    borderRadius: 5,
    marginVertical: 8,
    padding: 8,
  },
  messageImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginTop: -20,
  },
  otherMessage: {
    marginRight: 32,
    marginLeft: 8,
    backgroundColor: '#D0D1D5',
  },
  currentUserMessage: {
    marginRight: 8,
    marginLeft: 32,
    backgroundColor: '#3574DA',
  },
  messageText: {
    fontSize: 16,
  },
  currentUserText: {
    color: 'white',
  },
};
