import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image } from 'react-native';
import { connect } from 'react-redux';

const Recording = ({name, date, duration, play}) => (
    <View style={styles.container}>
        <TouchableHighlight onPress={() => { play(); }}>
            <View style={styles.recordingInfo}>
                <Text style={styles.text}>{name}</Text>
                <Text style={styles.text}>{date}</Text>
            </View>
        </TouchableHighlight>
        <Text style={styles.text}>{duration}</Text>
        <TouchableHighlight style={styles.moreButton} onPress={() => {console.warn('this is where you play')}}>
            <Image source={require('../../img/list2.png')} style={styles.icon}></Image>
        </TouchableHighlight>
    </View>);

Recording.propTypes = { 
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    play: PropTypes.func.isRequired,
};

export default Recording;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text : {
        color: '#F5FCFF',
    },
    recordingInfo: {
        flexDirection: 'column',
        flex: 1,
        alignSelf: 'flex-start',
    },
    moreButton: {
        backgroundColor: "#00e19e",
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 30
    },
});
