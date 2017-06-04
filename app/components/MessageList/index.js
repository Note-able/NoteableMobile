import React from 'react';
import { ScrollView, View, Text, TouchableHighlight, Image } from 'react-native';

const MessageList = ({ conversations, userId, onSelectConversation }) => {
  const list = Object.keys(conversations).map((id) => {
    const conversation = conversations[id];
    const otherUserId = Object.keys(conversation.users).find(uid => uid !== userId);
    const user = conversation.users[otherUserId];
    return (
      <TouchableHighlight key={id} onPress={() => { onSelectConversation(id, user.id); }}>
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

export default MessageList;

const styles = {
  messageContainer: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D0D1D5',
  },
  messagePicture: {
    height: 50,
    width: 50,
    borderRadius: 30,
    marginHorizontal: 16,
  },
  messageInfo: {
    flexDirection: 'column',
    marginHorizontal: 8,
    flex: 1,
  },
  messageName: {
    fontSize: 18,
    color: 'black',
  },
  messageTime: {
    marginHorizontal: 16,
  },
};

/*
conversations = [
            {
                id: '1',
                users: [{
                    id: 123,
                    name: 'Ian Mundy',
                    profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
                },{
                    id: 234,
                    name: 'Sportnak',
                    profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
                }],
                groupId: null,
                name: null,
                messages: [
                    {
                        id: '1',
                        content: 'The assyrian came down like a wolf on the fold', 
                        user: {   
                            name: 'Ian Mundy',
                            profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
                        }, 
                    },
                    {
                        id: '2',
                        content: 'The assyrian came down like a wolf on the fold', 
                        user: {   
                            name: 'Sportnak',
                            profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
                        }, 
                    },
                    {
                        id: '3',
                        content: 'The assyrian came down like a wolf on the fold', 
                        user: {   
                            name: 'Ian Mundy',
                            profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
                        }, 
                    },
                ]
            }
        ];
*/
