import React from 'react';
import { View, Text, Image } from 'react-native';

const User = ({ user, message }) => (
  <View style={styles.container}>
    <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
    <Text style={styles.messageText}>
      <Text style={styles.userName}>{user.name}</Text>
      {` ${message}`}
    </Text>
  </View>
);

export default User;

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  userName: {
    fontWeight: 'bold',
  },
  messageText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 16,
  },
};
