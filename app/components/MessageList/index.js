import React from 'react';
import { ScrollView, View, Text, TouchableHighlight, Image } from 'react-native';

const MessageList = ({conversations, userId}) => {
    const list = Object.keys(conversations).map((id) => {
        const conversation = conversations[id];
        const user = conversation.users[0].id !== userId ? conversation.users[0] : conversation.users[1];
        return (
            <View key={id} style={styles.messageContainer}>
                <Image source={{uri: user.profileImage }} style={styles.messagePicture}></Image>
                <View style={styles.messageInfo}>
                    <Text numberOflines={1} ellipsizeMode="tail" style={styles.messageName}>{user.name}</Text>
                    <Text numberOflines={1} ellipsizeMode="tail">{conversation.messages[0].content}</Text>
                </View>
                <Text>Now</Text>
            </View>);
    });
    return (
        <ScrollView>
            {list}
        </ScrollView>
    );
}

export default MessageList;

const styles = {
    messageContainer: {
        height: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#D0D1D5',
    },
    messagePicture: {
        height: 60,
        width: 60,
        borderRadius: 30,
    },
    messageInfo: {
        flexDirection: 'column',
        marginHorizontal: 8,
    },
    messageName: {
        fontSize: 18,
        color: 'black',
    }
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
