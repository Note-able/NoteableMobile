import React from 'react';
import {View, Text, Image, TouchableHighlight} from 'react-native';

import User from './User';

const SongCard = ({card,}) => (
    <View style={styles.container}>
        <User user={card.user} message={card.message} />
        <View style={styles.songCard}>
            <TouchableHighlight>
                <Image source={require('../../img/play.png')} style={styles.playButton} />
            </TouchableHighlight>
            <Text style={styles.songTitle}>{card.song}</Text>
            <Image source={require('../../img/more_horiz.png')} style={styles.moreButton} />
        </View>
        <View style={styles.socialProof}>
            <Text style={styles.socialText}>{`${card.comments.length} comments`}</Text>
            <Text style={styles.socialText}>{`${card.likes.length} likes`}</Text>
        </View>
    </View>
);

export default SongCard;

const styles= {
    container: {
        maxHeight: 160,
        margin: 8,
        padding: 16,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    songCard: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D0D1D5',
        paddingVertical: 4,
    },
    songTitle: {
        flex: 1,
        fontSize: 20,
    },
    socialProof: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    socialText: {
        marginHorizontal: 4,
        marginTop: 8,
    },
    playButton: {
        height: 40,
        width: 40,
        marginLeft: 8,
        marginRight: 4,
    },
    moreButton: {
        height: 30,
        width: 30,
        marginHorizontal: 16,
    }
};
