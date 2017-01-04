import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';

const Recording = ({name, date, duration, loadRecording}) => (
    <View style={styles.container}>
        <TouchableHighlight style={{flex: 3}} onPress={() => { loadRecording(name); }}>
            <View style={styles.recordingInfo}>
                <Text style={styles.largeText} ellipsizeMode="tail" numberOfLines={1}>{name}</Text>
                <Text style={styles.text}>{date}</Text>
            </View>
        </TouchableHighlight>
        <Text style={[styles.text, {flex: 1}]}>{duration}</Text>
        <TouchableHighlight style={styles.moreButton} onPress={() => {console.warn('this is where you show more')}}>
            <Image source={require('../../img/more_horiz.png')}></Image>
        </TouchableHighlight>
    </View>);

Recording.propTypes = { 
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    loadRecording: PropTypes.func.isRequired,
};

export default Recording;

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 50,
        width: windowWidth,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 5,
        marginHorizontal: 20,
    },
    largeText: {
        fontSize: 16,
        color: '#32302f',
    },
    text: {
        color: '#7a7b86',
    },
    recordingInfo: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    moreButton: {
        flex: 1,
        marginVertical: 15,
        height: 20,
        alignSelf: 'flex-end',
    },
});
