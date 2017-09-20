import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableHighlight, ScrollView } from 'react-native';

import ProfileInfo from '../../components/ProfileInfo/index.js';
import { getUser } from '../../actions/accountActions';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  getCurrentUser: (user) => { dispatch(getUser(user)); },
});

class Profile extends Component {
  static propTypes = {
    getCurrentUser: PropTypes.func.isRequired,
    profile: PropTypes.shape({}),
    user: PropTypes.shape({}),
  }

  _views = {};
  _scrollView = {};

  componentDidMount() {
  }

  setViewY = (event, view) => {
    this._views[view] = { y: event.nativeEvent.layout.y };
  }

  scrollToView = (view) => {
    this._scrollView.scrollTo({ y: this._views[view].y });
  }

  render() {
    const { profile } = this.props;
    if (!profile) { return null; }
    const { coverImage, avatarUrl, firstName, lastName, bio } = profile;
    const name = `${firstName} ${lastName}`;
    return (
      <View style={styles.container}>
        <ScrollView ref={(ref) => { this._scrollView = ref; }}>
          <ProfileInfo
            coverImage={coverImage || 'default'}
            profileImage={avatarUrl || 'default'}
            name={name}
            bio={bio}
            onLayout={this.setViewY}
          />
        </ScrollView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  navBar: {
    top: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D93A64',
    height: 45,
  },
  navTitle: {
    padding: 10,
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  navBackArrow: {
    height: 30,
    width: 30,
    marginLeft: 16,
  },
  green: {
    backgroundColor: '#31CB94',
  },
});

/*
profile = {
            id: 1,
            email: 'sportnak@gmail.com',
            firstName: 'Ian',
            lastName: 'Mundy',
            location: 'Bellingham, WA',
            profession: 'shipping',
            coverImage: 'http://www.ourdunya.com/wp-content/uploads/2014/10/Be-Yourself-fb-cover.jpg',
            avatarUrl: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
            bio: `The Assyrian came down like the wolf on the fold, And his cohorts
             were gleaming in purple and gold;
              And the sheen of their spears
               was like stars on the sea, When the blue wave rolls nightly on deep Galilee.`,
            preferences: {
                instruments: ['Guitar', 'Bass', 'Drums', 'Flute', 'Didgeridoo'],
                isLooking: true,
                displayLocation: false,
                preferredGenres: null,
            },
            zipCode: 98225,
        }
*/
