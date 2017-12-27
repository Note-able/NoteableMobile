import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image, Dimensions } from 'react-native';

export default function ProfileInfo({ coverImage, profileImage, name, bio, onLayout }) {
  return (
    <View onLayout={event => onLayout(event, 'about')}>
      <View style={styles.coverImageView}>
        <Image
          source={{ uri: coverImage }}
          style={styles.coverImage}
        />
      </View>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageView}>
          <Image
            source={{ uri: profileImage }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.bio}>
        <Text style={styles.header}>About</Text>
        <Text style={styles.description}>{bio}</Text>
      </View>
    </View>
  );
}

ProfileInfo.propTypes = {
  coverImage: PropTypes.string.isRequired,
  profileImage: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
  onLayout: PropTypes.func.isRequired,
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = {
  bio: {
    margin: 20,
  },
  profileImageView: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft: 20,
    elevation: 10,
    backgroundColor: '#1B1F20',
    alignSelf: 'flex-start',
  },
  profileImage: {
    flex: 1,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#1B1F20',
    borderWidth: 2,
  },
  coverImageView: {
    height: 200,
    elevation: 10,
    backgroundColor: '#1B1F20',
  },
  coverImage: {
    height: 200,
    width: windowWidth,
  },
  description: {
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
  },
  profileHeader: {
    width: windowWidth,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: -70,
    marginBottom: 20,
    height: 100,
  },
  name: {
    marginLeft: 20,
    color: 'white',
    fontSize: 30,
    elevation: 10,
  },
};
