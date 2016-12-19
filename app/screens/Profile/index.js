import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    Dimensions,
    ScrollView,
} from 'react-native';

import ProfileInfo from '../../app/components/ProfileInfo/index.js';
import Interests from '../../app/components/Interests/index.js';

export default class Profile extends Component {
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
        this.state = { profile };
    }
    
    render() {
        const { coverImage, profileImage, name, description, interests, instruments } = this.state;
        return(
            <ScrollView style={styles.container}>
                <View style={styles.screen}>
                    <View style={styles.navBar}>
                        <Text style={styles.navTitle}>About</Text>
                        <Text style={styles.navTitle}>Interest</Text>
                        <Text style={styles.navTitle}>Music</Text>
                    </View>
                    <ProfileInfo  coverImage={coverImage} profileImage={profileImage} name={name} description={description} />
                    <Interests instruments={instruments} />
                </View>
            </ScrollView>
        );
    }
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = {
    container: {
        backgroundColor: 'white',
    },
    screen: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: windowWidth,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D93A64',
        width: windowWidth,
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
