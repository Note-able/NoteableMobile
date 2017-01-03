import React from 'react';
import {View, Text, Image, TouchableHighlight} from 'react-native';

import User from './User';

const JoinedCard = () => (
    <View style={styles.container}>
        <User user={card.user} message={card.message} />
    </View>
);

export default JoinedCard;

const styles= {
    container: {
        flex: 1,
    }
};
