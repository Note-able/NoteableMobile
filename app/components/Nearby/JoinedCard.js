import React from 'react';
import {View, Text, Image, TouchableHighlight} from 'react-native';

import User from './User';

const JoinedCard = ({card,}) => (
    <View style={styles.container}>
        <User user={card.user} message={card.message} />
        { card.users.map((user) => (<UserCTA key={user.id} user={user} />)) }
    </View>
);

export default JoinedCard;

const UserCTA = ({user}) => (
    <View style={styles.userCard}>
        <Image source={{uri: user.profileImage}} style={styles.userImage} />
        <Text style={styles.userName}>{user.name}</Text>
        <TouchableHighlight>
            <Text style={styles.followText}>Follow</Text>
        </TouchableHighlight>
        <TouchableHighlight>
            <Text style={styles.messageText}>Message</Text>
        </TouchableHighlight>
    </View>
);

const styles= {
    container: {
        margin: 8,
        padding: 16,
        borderRadius: 2,
        backgroundColor: 'white',
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D0D1D5',
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginVertical: 8,
    },
    userImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    userName: {
        flex: 1,
        fontSize: 20,
        marginHorizontal: 8,
    },
    followText: {
        marginHorizontal: 8,
        fontSize: 16,
        color: '#1875DC',
    },
    messageText: {
        marginHorizontal: 8,
        fontSize: 16,
        color: '#31CB94',
    }
};
