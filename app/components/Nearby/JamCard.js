import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

import User from './User';

const JamCard = ({ card }) => (
  <View style={styles.container}>
    <User user={card.user} message={card.message} />
    <Text style={styles.lookingText}><Text style={styles.bold}>Looking for: </Text>{card.musicians.join(', ')}</Text>
    <TouchableHighlight style={styles.messageButton} onPress={() => { console.warn('open message'); }}>
      <Text style={styles.buttonText}>Message</Text>
    </TouchableHighlight>
    <View style={styles.socialProof}>
      <Text style={styles.socialText}>{`${card.comments.length} comments`}</Text>
      <Text style={styles.socialText}>{`${card.likes.length} likes`}</Text>
    </View>
  </View>
);

export default JamCard;

const styles = {
  container: {
    margin: 8,
    padding: 16,
    borderRadius: 2,
    backgroundColor: 'white',
  },
  lookingText: {
    fontSize: 16,
    marginLeft: 40,
    marginTop: 8,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  socialProof: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  socialText: {
    marginHorizontal: 4,
  },
  messageButton: {
    backgroundColor: '#31CB94',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    width: 100,
    height: 40,
    marginLeft: 40,
  },
  buttonText: {
    color: 'white',
  },
};
