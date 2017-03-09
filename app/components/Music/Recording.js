import React, { PropTypes } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { colors } from '../../styles';

const Recording = ({name, date, duration, loadRecording, select, showSelect, selected, isSynced }) => {
    const innerContent = (        
        <View style={styles.container}>
            { showSelect ? <Icon name={selected ? 'check-box' : 'check-box-outline-blank'} size={30} style={styles.checkBox} color={ colors.green } /> : null }
            <TouchableHighlight style={{flex: 3}} onPress={() => { loadRecording(name); }} onLongPress={() => { select(name); }}>
                    <Text style={styles.largeText} ellipsizeMode="tail" numberOfLines={1}>{name}</Text>
            </TouchableHighlight>
            <Text style={styles.text}>{duration}</Text>
            <Text style={styles.text}>{date}</Text>
            <TouchableHighlight style={styles.moreButton} onPress={() => {console.warn('this is where you show more')}}>
                <Image source={require('../../img/more_horiz.png')}></Image>
            </TouchableHighlight>
            <View style={ isSynced ? styles.syncBorder : styles.none } />
        </View>);

    if (showSelect) {
        return (
            <TouchableHighlight onPress={() => { select(name); }}>
                {innerContent}
            </TouchableHighlight>
        );
    }

    return innerContent;
};

Recording.propTypes = { 
    showSelect: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    loadRecording: PropTypes.func.isRequired,
    toggleSync: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    isSynced: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired,
};

export default Recording;

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 50,
        width: windowWidth - 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 20,
    },
    largeText: {
        fontSize: 16,
        color: colors.mediumDark,
    },
    text: {
        color: colors.medium,
        marginHorizontal: 4,
    },
    recordingInfo: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    moreButton: {
        width: 20,
        marginHorizontal: 15,
        height: 20,
    },
    checkBox: {
        height: 40,
        width: 40,
    },
    syncBorder: {
        flex: 0,
        backgroundColor: colors.green,
        width: 5,
        height: 50,
    },
    none: {
        flex: 0,
        backgroundColor: colors.orange,
        width: 5,
        height: 50
    }
});
