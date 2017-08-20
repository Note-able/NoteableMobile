import React from 'react';
import { ScrollView, View, Text, TouchableHighlight, Image } from 'react-native';

import styles from './styles';

const Conversations = ({ conversations, userId, onOpenConversation }) => {
  const list = conversations && Object.keys(conversations).map((id) => {
    const conversation = conversations[id];
    const otherUserId = Object.keys(conversation.users).find(uid => uid !== userId);
    const user = conversation.users[otherUserId];
    return (
      <TouchableHighlight key={id} onPress={() => { onOpenConversation(userId, user.id, id); }}>
        <View style={styles.messageContainer}>
          <Image source={{ uri: user.avatarUrl }} style={styles.messagePicture} />
          <View style={styles.messageInfo}>
            <Text numberOflines={1} ellipsizeMode="tail" style={styles.messageName}>{`${user.firstName} ${user.lastName}`}</Text>
            <Text numberOflines={1} ellipsizeMode="tail">{conversation.lastMessage.content}</Text>
          </View>
          <Text style={styles.messageTime}>Now</Text>
        </View>
      </TouchableHighlight>);
  });
  return (
    <ScrollView>
      {list}
    </ScrollView>
  );
};

export default Conversations;
