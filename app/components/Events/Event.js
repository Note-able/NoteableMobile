import React from 'react';
import { View, Text, Image, TouchableHighlight } from 'react-native';

const Event = ({event, containerStyles}) => (
    <View style={[styles.container, containerStyles]}>
        <Image source={{uri: event.image}} style={styles.eventImage}></Image>
        <View style={styles.eventInfoContainer}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text>{event.dateTime}</Text>
            <Text numberOfLines={5} ellipsizeMode='tail' style={styles.eventDescription}>{event.description}</Text>
            <View style={styles.buttons}>
                <TouchableHighlight style={styles.attendingButton}>
                    <Text style={styles.buttonText}>Attending</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.shareButton}>
                    <Text style={styles.buttonText}>Share</Text>
                </TouchableHighlight>
            </View>
        </View>
    </View>
);

export default Event;

const styles = {
    container: {
        height: 200,
        padding: 16,
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: 'white',
        
    },
    eventImage: {
        flex: 2,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
    },
    eventInfoContainer: {
        flex: 3,
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
    buttons: {
        flexDirection: 'row',
        height: 66,
        marginRight: 32,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    attendingButton: {
        borderRadius: 2,
        flex: 1,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        marginLeft: 16,
        backgroundColor: '#F0A63E'
    },
    shareButton: {
        borderRadius: 2,
        flex: 1,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        marginLeft: 16,
        backgroundColor: '#31CB94'
    },
    buttonText: {
        color: 'white'
    }
}
