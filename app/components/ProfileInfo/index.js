import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
} from 'react-native';

export default function ProfileInfo({coverImage, profileImage, name, description}) {
    return(
        <View>
            <View style={styles.coverImageView}>
                <Image source={{uri: coverImage }} 
                    style={styles.coverImage}/>
            </View>
            <View style={styles.profileHeader}>
                <View style={styles.profileImageView}>
                    <Image source={{uri: profileImage }} 
                        style={styles.profileImage} />
                </View>
                <Text style={styles.name}>{name}</Text>
            </View>
            <View style={styles.bio}>
                <Text style={styles.header}>About</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    );
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
    bio: {
        margin: 20,  
    },
    navTitle: {
        padding: 10,
        color: 'white',
        fontSize: 20,
        marginLeft: 10,
        marginRight: 10,
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
    interests: {
        flexDirection: 'column',
        width: windowWidth,
        alignItems: 'center',
    },
    interestsHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: windowWidth,
    },
    interestHeaderView: {
        width: windowWidth/2,
        marginBottom: 10,
    },
    interestHeader: {
        fontSize: 26,
        width: windowWidth/2,
        height: 40,
        textAlign: 'center',
    },
    selectedInterestCategory: {
        borderColor: '#31CB94',
        borderBottomWidth: 4,
    },
    interestTiles: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    interestTile: {
        height: 105,
        width: windowWidth/2,
    },
    interest: {
        width: windowWidth/2 - 24,
        height: 100,
        marginLeft: 8,
    },
    interestTextOverlay: {
        height: 100,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    interestText: {
        color: 'white',
        fontSize: 30,
    },
    green: {
        backgroundColor: '#31CB94'
    }
}
