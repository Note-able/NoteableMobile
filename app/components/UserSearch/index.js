import React from 'react';
import { ScrollView, View, Text, TouchableHighlight, Image, Dimensions } from 'react-native';

const UserSearch = ({ handleUserPress, users }) => {
  const userList = Object.keys(users).map((id) => {
    const user = users[id];
    return (
      <TouchableHighlight key={id} onPress={() => { handleUserPress(id); }}>
        <View style={styles.user}>
          <Image style={styles.userImage} source={{ uri: user.profileImage }} />
          <Text style={styles.name}>{user.name}</Text>
        </View>
      </TouchableHighlight>
    );
  });

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        {userList}
      </View>
    </ScrollView>
  );
};

export default UserSearch;

const windowWidth = Dimensions.get('window').width;

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  user: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D1D5',
    width: windowWidth,
  },
  userImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginHorizontal: 24,
  },
  name: {
    fontSize: 18,
  },
};
