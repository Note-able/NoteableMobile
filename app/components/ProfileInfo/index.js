import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';

export default class ProfileInfo extends Component {
  static propTypes = {
    coverImage: PropTypes.string,
    profileImage: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    bio: PropTypes.string,
    saveProfile: PropTypes.func.isRequired,
  };

  state = {
    isEditMode: true,
    editName: `${this.props.firstName} ${this.props.lastName}`,
    editBio: this.props.bio,
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { coverImage, profileImage, firstName, lastName, bio } = this.props;
    const { isEditMode, editName, editBio } = this.state;

    return (nextState.isEditMode !== isEditMode || nextState.editName !== editName || nextState.editBio !== editBio ||
      coverImage !== nextProps.coverImage || profileImage !== nextProps.profileImage || firstName !== nextProps.firstName || lastName !== nextProps.lastName || bio !== nextProps.bio);
  }

  componentWillReceiveProps(nextProps) {
    const { coverImage, profileImage, firstName, lastName, bio } = this.props;

    if (this.state.submitting && (coverImage !== nextProps.coverImage || profileImage !== nextProps.profileImage || firstName !== nextProps.firstName || lastName !== nextProps.lastName || bio !== nextProps.bio)) {
      this.setState({
        isEditMode: false,
        submitting: false,
      });
    }
  }

  saveProfile = () => {
    if (this.state.editName.length === 0) {
      return;
    }

    this.setState({
      submitting: true,
    });

    const hasLastName = this.state.editName.split(' ').length !== 1;
    this.props.saveProfile({
      firstName: this.state.editName.split(' ')[0],
      lastName: hasLastName ? this.state.editName.split(' ')[1] : '',
      bio: this.state.editBio,
    });
  }

  renderEditMode() {
    const { coverImage, profileImage } = this.props;
    return (
      <View>
        <TouchableOpacity style={styles.edit.close} onPress={() => this.setState({ isEditMode: false })}>
          <Icon name="close" size={32} style={{ width: 32, height: 32 }} color={colors.shade140} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.edit.save} onPress={this.saveProfile}>
          <Text style={{ color: 'white', fontSize: 16 }}>Save</Text>
        </TouchableOpacity>
        <View style={styles.coverImageView}>
          <Image
            source={{ uri: coverImage }}
            style={styles.coverImage}
          />
          <View style={styles.coverImageScreen} />
        </View>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageView}>
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.edit.name}>
            <TextInput numberOfLines={1} onChangeText={text => this.setState({ editName: text })} style={{ marginRight: 4, fontSize: 24, width: windowWidth - 155, color: 'white', height: 32 }} value={this.state.editName} />
          </View>
        </View>
        <View style={styles.bio}>
          <Text style={styles.header}>About</Text>
          <View style={styles.edit.description}>
            <TextInput
              autoGrow
              style={{ minHeight: 30, width: '100%', backgroundColor: 'white', fontSize: 16, lineHeight: 28 }}
              value={this.state.editBio}
              multiline
              placeholder="Tell the world who you are."
              placeholderTextColor="#888888"
            />
          </View>
        </View>
      </View>
    );
  }

  render() {
    if (this.state.isEditMode) {
      return this.renderEditMode();
    }

    const { coverImage, profileImage, firstName, lastName, bio } = this.props;
    const name = `${firstName} ${lastName}`;
    return (
      <View>
        <View style={styles.coverImageView}>
          <Image
            source={{ uri: coverImage }}
            style={styles.coverImage}
          />
          <View style={styles.coverImageScreen} />
        </View>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageView}>
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
          </View>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.name}>{name}</Text>
          <TouchableOpacity style={styles.button} onPress={() => this.setState({ isEditMode: true })}>
            <Icon name="create" size={24} style={{ width: 24, height: 24 }} color={colors.shade140} />
          </TouchableOpacity>
        </View>
        <View style={styles.bio}>
          <Text style={styles.header}>About</Text>
          <Text style={styles.description}>{bio}</Text>
        </View>
      </View>
    );
  }
}

const windowWidth = Dimensions.get('window').width;

const styles = {
  bio: {
    margin: 20,
  },
  profileImageView: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    marginLeft: 20,
    elevation: 10,
    backgroundColor: '#1B1F20',
    marginRight: 20,
    alignSelf: 'flex-start',
  },
  profileImage: {
    flex: 1,
    width: 75,
    height: 75,
    borderRadius: 37.5,
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
  coverImageScreen: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: windowWidth,
    height: 200,
  },
  description: {
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    marginHorizontal: 8,
  },
  profileHeader: {
    width: windowWidth,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 20,
  },
  name: {
    marginTop: -24,
    marginLeft: 20,
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 24,
    elevation: 10,
    maxWidth: windowWidth - 175,
  },
  button: {
    backgroundColor: 'transparent',
    marginLeft: 8,
    height: 50,
    width: 50,
  },
  edit: {
    description: {
      backgroundColor: 'white',
      shadowColor: 'rgba(0, 0, 0, 0.4)',
      shadowRadius: 2,
      shadowOpacity: 1,
      justifyContent: 'flex-start',
      minHeight: 30,
      width: '100%',
      borderRadius: 4,
      borderBottomWidth: 1,
      borderColor: '#ccc',
      paddingHorizontal: 8,
      paddingBottom: 4,
      overflow: 'hidden',
    },
    close: {
      left: 20,
      position: 'absolute',
      backgroundColor: 'transparent',
      top: 40,
      elevation: 100,
      zIndex: 10,
      height: 50,
      width: 50,
    },
    name: {
      marginTop: -24,
      borderBottomWidth: 1,
      borderRadius: 4,
      borderBottomColor: 'white',
      backgroundColor: 'transparent',
      elevation: 10,
      flexDirection: 'row',
    },
    save: {
      borderRadius: 4,
      position: 'absolute',
      top: 40,
      right: 20,
      zIndex: 10,
      backgroundColor: colors.green,
      height: 36,
      width: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
};
