import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImagePickerIOS,
  Platform,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';
import {
  getUser,
  loadCurrentProfile,
  saveProfile,
} from '../../actions/accountActions';

Animatable.initializeRegistryWithDefinitions({
  fadeInUpCust: {
    from: { translateY: 40, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
  },
  fadeInDownCust: {
    from: { translateY: -40, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
  },
});

const mapStateToProps = state => ({
  user: state.AccountReducer.user,
  profile: state.AccountReducer.profile,
  isProcessing: state.AccountReducer.isProcessing,
  isLoading: state.AccountReducer.isLoading,
});

const mapDispatchToProps = dispatch => ({
  getCurrentUser: (user) => { dispatch(getUser(user)); },
  loadCurrentProfile: () => dispatch(loadCurrentProfile()),
  saveProfile: profile => dispatch(saveProfile(profile)),
});

class ProfileInfo extends Component {
  static propTypes = {
    profile: PropTypes.shape({
      coverImage: PropTypes.string,
      avatarUrl: PropTypes.string,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      bio: PropTypes.string,
      canEdit: PropTypes.bool,
    }),
    saveProfile: PropTypes.func.isRequired,
  };

  state = {
    isEditMode: false,
    isLoading: true,
  }

  componentDidMount() {
    if (this.props.profile != null) {
      this.setEditProfile(this.props);
    } else {
      this.props.loadCurrentProfile();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateKeys = Object.keys(this.state);
    const propsKeys = Object.keys(this.props).filter(key => typeof this.props[key] !== 'function');

    return stateKeys.filter(key => this.state[key] !== nextState[key]).length !== 0 || propsKeys.filter(key => this.props[key] !== nextProps[key]).length !== 0;
  }

  componentWillReceiveProps(nextProps) {
    const { coverImage, avatarUrl, firstName, lastName, bio } = this.props;

    if (!this.props.isLoading && this.state.isLoading) {
      this.setState({
        isLoading: false,
      });
    }

    if (this.props.profile == null && nextProps.profile != null) {
      this.setEditProfile(nextProps);
    }

    if (this.state.submitting && (coverImage !== nextProps.coverImage || avatarUrl !== nextProps.avatarUrl || firstName !== nextProps.firstName || lastName !== nextProps.lastName || bio !== nextProps.bio)) {
      this.setState({
        isEditMode: false,
        submitting: false,
      });
    }
  }

  setEditProfile = (props) => {
    this.setState({
      editName: `${props.profile.firstName} ${props.profile.lastName}`,
      editBio: props.profile.bio,
      editImage: null,
      isLoading: false,
    });
  }

  saveProfile = () => {
    if (this.state.editName.length === 0) {
      return;
    }

    this.setState({
      submitting: true,
    });

    const hasLastName = this.state.editName.split(' ').length !== 1;
    this.props.profile.saveProfile({
      firstName: this.state.editName.split(' ')[0],
      lastName: hasLastName ? this.state.editName.split(' ')[1] : '',
      bio: this.state.editBio,
      profileImage: this.state.editImage || this.props.profile.avatarUrl,
      coverImage: this.state.editCoverImage || this.props.profile.coverImage,
    });
  }

  pickImage = (property) => {
    if (Platform.OS === 'ios') {
      this.setState({ isChoosingImage: true });
      if (ImagePickerIOS) {
        ImagePickerIOS.openSelectDialog(
          {},
          imageUri => this.setState({ [property]: imageUri }),
          error => this.setState({ error }),
        );
      }
    }
  }

  renderEditMode() {
    return (
      <View style={styles.edit.screen}>
        <View style={styles.edit.buttons}>
          <Animatable.View animation="slideInRight" easing="ease-out-expo" duration={500} delay={100}>
            <TouchableOpacity style={[styles.edit.save, styles.edit.cancel]} onPress={() => this.setState({ isEditMode: false })}>
              <Text style={{ color: colors.red, fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View animation="slideInRight" easing="ease-out-expo" duration={500}>
            <TouchableOpacity style={styles.edit.save} onPress={this.saveProfile}>
              <Text style={{ color: colors.white, fontSize: 16 }}>Save</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
        <Animatable.View animation="fadeIn" duration={500} style={[styles.coverImageView, { backgroundColor: 'transparent' }]}>
          <TouchableOpacity onPress={() => this.pickImage('editCoverImage')} style={styles.edit.coverImageButton}>
            <Icon name="photo-camera" size={32} style={{ width: 32, height: 32 }} color={colors.shade140} />
          </TouchableOpacity>
          {this.state.editCoverImage ?
            <Image
              source={{ uri: this.state.editCoverImage }}
              style={styles.coverImage}
            /> :
            <View
              style={[styles.coverImage, { backgroundColor: 'transparent' }]}
            />}
        </Animatable.View>
        <View style={styles.profileHeader}>
          <Animatable.View animation="fadeIn" duration={500} style={[styles.profileImageView, { backgroundColor: 'transparent' }]}>
            {this.state.editImage && <Image source={{ uri: this.state.editImage }} style={styles.profileImage} />}
            <TouchableOpacity onPress={() => this.pickImage('editImage')} style={[styles.profileImage, styles.edit.profileImage]}>
              <Icon name="photo-camera" size={32} style={{ width: 32, height: 32 }} color={colors.shade140} />
            </TouchableOpacity>
          </Animatable.View>
          <View style={styles.edit.name}>
            <TextInput numberOfLines={1} onChangeText={text => this.setState({ editName: text })} style={styles.edit.nameInput} value={this.state.editName} />
          </View>
        </View>
        <View style={styles.bio}>
          <Text style={styles.header}>About</Text>
          <View style={styles.edit.description}>
            <TextInput
              autoGrow
              onChangeText={text => this.setState({ editBio: text })}
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

  goHome = () => {
    this.props.navigation.goBack();
  }

  render() {
    const globalNav = this.props.screenProps.screenProps.stackNavigation.navigate;
    if (this.state.isLoading && this.props.profile == null) {
      return (
        <View style={{ backgroundColor: colors.shade10, height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.shade90, fontSize: 20, marginBottom: 20 }}>Loading</Text>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (this.props.profile == null) {
      return (
        <View style={{ width: '100%', height: '100%', backgroundColor: colors.shade10, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, color: colors.shade90 }}>Sign in to see your profile!</Text>
          <TouchableOpacity style={{ width: 100 }} onPress={() => globalNav('Authentication')}>
            <View style={styles.authButton}>
              <Text>Login</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    const { coverImage, avatarUrl, bio } = this.props.profile;
    let { firstName, lastName } = this.props.profile;

    firstName = firstName[0].toUpperCase() + firstName.substring(1);
    lastName = lastName[0].toUpperCase() + lastName.substring(1);

    const canEdit = this.props.profile.id === this.props.user.id;
    const name = `${firstName} ${lastName}`;

    return (
      <View style={{ height: '100%', backgroundColor: 'white' }}>
        {this.state.isEditMode && canEdit && this.renderEditMode()}
        {!this.state.isEditMode &&
          <TouchableOpacity style={{ position: 'absolute', top: 28, left: 20, zIndex: 11, backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 18 }} onPress={this.goHome}>
            <Icon name="keyboard-arrow-left" size={36} style={{ width: 36, height: 36 }} color={colors.shade140} />
          </TouchableOpacity>}
        <Animatable.View style={styles.coverImageView} animation="fadeInDownCust" duration={500} easing="ease-out-cubic">
          <Image
            source={{ uri: coverImage }}
            style={styles.coverImage}
          />
          <View style={styles.coverImageScreen} />
        </Animatable.View>
        <View style={styles.profileHeader}>
          <Animatable.View style={styles.profileImageView} animation="fadeInUpCust" duration={800}>
            <Image
              source={{ uri: avatarUrl }}
              style={styles.profileImage}
            />
          </Animatable.View>
          {!this.state.isEditMode && <Animatable.Text ellipsizeMode="tail" numberOfLines={1} style={styles.name} animation="fadeIn">{name}</Animatable.Text>}
          {!this.state.isEditMode && canEdit &&
            <TouchableOpacity style={styles.button} onPress={() => this.setState({ isEditMode: true })}>
              <Icon name="create" size={24} style={{ width: 24, height: 24 }} color={colors.shade140} />
            </TouchableOpacity>
          }
        </View>
        {!this.state.isEditMode && <View style={styles.bio}>
          <Animatable.Text animation="fadeIn" duration={700} style={styles.header}>About</Animatable.Text>
          <Animatable.Text animation="fadeIn" duration={700} style={styles.description}>{bio}</Animatable.Text>
        </View>}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo);

const windowWidth = Dimensions.get('window').width;

const styles = {
  bio: {
    marginHorizontal: 20,
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
    backgroundColor: 'transparent',
    marginHorizontal: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    marginHorizontal: 8,
    backgroundColor: 'transparent',
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
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 24,
    elevation: 10,
    width: windowWidth - 175,
  },
  button: {
    backgroundColor: 'transparent',
    marginLeft: 8,
    height: 50,
    width: 50,
  },
  edit: {
    nameInput: {
      marginRight: 4,
      fontSize: 24,
      width: windowWidth - 155,
      color: 'white',
      height: 32,
    },
    profileImage: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      width: 75,
      height: 75,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    screen: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      top: 0,
      zIndex: 10,
    },
    coverImageButton: {
      width: 75,
      height: 75,
      zIndex: 10,
      position: 'absolute',
      top: 20,
      right: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
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
      zIndex: 10,
      backgroundColor: colors.green,
      height: 36,
      width: 80,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cancel: {
      marginBottom: 24,
      backgroundColor: 'white',
      borderColor: colors.red,
      borderWidth: 1,
    },
    buttons: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      padding: 20,
      shadowColor: 'black',
      shadowOpacity: 1,
      shadowRadius: 75,
      shadowOffset: { width: 25, height: 25 },
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
};
