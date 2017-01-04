import React from 'react';
import {View, Text, Image, TouchableHighlight} from 'react-native';

import User from './User';

const EventCard = ({card}) => (
    <View style={styles.container}>
        <User user={card.user} message={card.message} />
        <View style={styles.eventCard}>
            <Image source={{uri: card.image}} style={styles.eventImage}></Image>
            <View style={styles.eventInfoContainer}>
                <Text style={styles.eventTitle}>{card.title}</Text>
                <Text>{card.dateTime}</Text>
                <Text numberOfLines={5} ellipsizeMode='tail' style={styles.eventDescription}>{card.description}</Text>
            </View>
        </View>
    </View>
);

export default EventCard;

const styles= {
    container: {
        margin: 8,
        padding: 16,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    eventCard: {
        flex: 5,
        marginTop: 24,
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D0D1D5',
    },
    eventImage: {
        flex: 1,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
    },
    eventInfoContainer: {
        flex: 1,
        marginHorizontal: 8,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    eventDescription: {
        color: 'black',
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    eventDate: {
        
    }
};
