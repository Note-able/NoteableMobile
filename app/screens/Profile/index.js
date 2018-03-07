import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { profileScreens } from '../../components/People/index.js';
import {
  loadCurrentProfile,
  loadProfile,
  searchProfiles,
} from '../../actions/accountActions';


const AppNavigator = StackNavigator(profileScreens, {
  initialRouteName: 'Main',
  navigationOptions: { header: null },
});

const mapStateToProps = state => ({
  profile: state.AccountReducer.profile,
  search: state.AccountReducer.search,
  visibleProfile: state.AccountReducer.visibleProfile,
});

const mapDispatchToProps = dispatch => ({
  loadCurrentProfile: () => dispatch(loadCurrentProfile()),
  loadProfile: userId => dispatch(loadProfile(userId)),
  searchProfiles: text => dispatch(searchProfiles(text)),
});

class Profile extends Component {
  componentDidMount() {
    this.props.loadCurrentProfile();
  }

  render() {
    return (
      <AppNavigator screenProps={this.props} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

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
