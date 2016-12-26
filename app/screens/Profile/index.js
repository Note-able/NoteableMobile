import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    ScrollView,
} from 'react-native';

import ProfileInfo from '../../components/ProfileInfo/index.js';
import Interests from '../../components/Interests/index.js';
import RecordingList from '../../components/RecordingList/index.js';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({
    navigateback: () => {
        Actions.pop();
    },
});

class Profile extends Component {
    constructor(props) {
        super(props);
        const profile = {
            name: 'Ian Mundy',
            coverImage: 'http://www.ourdunya.com/wp-content/uploads/2014/10/Be-Yourself-fb-cover.jpg',
            profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
            description: `The Assyrian came down like the wolf on the fold, And his cohorts were gleaming in purple and gold; And the sheen of their spears was like stars on the sea, When the blue wave rolls nightly on deep Galilee.`,
            interests: [],
            instruments: ['Guitar', 'Bass', 'Drums', 'Flute', 'Didgeridoo'],
        }
        this._views = {};
        this._scrollView = {};
        this.state = { profile };
    }
    
    setViewY = (event, view) => {
        this._views[view] = { y: event.nativeEvent.layout.y };
    }
    
    scrollToView = (view) => {
        this._scrollView.scrollTo({y: this._views[view].y});
    }
    
    render() {
        const { coverImage, profileImage, name, description, interests, instruments } = this.state.profile;
        return(
            <View style={styles.container}>
                { ProfileNavBar({ scrollTo: this.scrollToView, navigate: this.props.navigateback }) }
                <ScrollView ref={ ref => {this._scrollView = ref;} }>
                    <ProfileInfo 
                        coverImage={coverImage}
                        profileImage={profileImage}
                        name={name}
                        description={description}
                        onLayout={this.setViewY} />
                    <Interests
                        instruments={instruments}
                        onLayout={this.setViewY} />
                    <RecordingList
                        onLayout={this.setViewY} />
                </ScrollView>
            </View>
        );
    }
};

const ProfileNavBar = ({scrollTo, navigate}) => (
    <View style={styles.navBar}> 
        <TouchableHighlight style={{ position: 'absolute', top: 0, left: 10, height: 45, justifyContent: 'center', alignItems: 'center' }}onPress={() => { navigate(); }}>
            <Text style={{ color: 'white' }}>back</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => { scrollTo('about'); }}>
            <Text style={styles.navTitle}>About</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => { scrollTo('interests'); }}>
        <Text style={styles.navTitle}>Interests</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => { scrollTo('music'); }}>
        <Text style={styles.navTitle}>Music</Text>
        </TouchableHighlight>
    </View>
);

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = {
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
    green: {
        backgroundColor: '#31CB94'
    }
}
