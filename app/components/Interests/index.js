
import React, { PropTypes, PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
} from 'react-native';

export default class Interests extends PureComponent {    
    static propTypes ={
        instruments: PropTypes.arrayOf(PropTypes.string).isRequired,
        onLayout: PropTypes.func.isRequired,
    };
    getImageForInstrument = (instrument) => 'http://beginnersguitarstudio.com/wp-content/uploads/2015/11/acoustic-guitar-tips.jpg';
    
    renderInterestTile = (instrument) => {
        return(
            <View key={instrument} style={styles.interestTile}>
                <Image source={{uri: this.getImageForInstrument(instrument)}}
                    style={styles.interest}>
                    <View style={styles.interestTextOverlay}>
                        <Text style={styles.interestText}>{instrument}</Text>
                    </View>
                </Image>
            </View>);
    }
    
    render() {
        const { instruments, onLayout } = this.props;
        return(
            <View style={styles.interests} onLayout={(event) => onLayout(event, 'interests')}>
                <View style={styles.interestsHeader}>
                    <View style={[styles.interestHeaderView, styles.selectedInterestCategory]}>
                        <Text style={styles.interestHeader}>Instruments</Text>
                    </View>
                    <View style={styles.interestHeaderView}>
                        <Text style={styles.interestHeader}>Genres</Text>
                    </View>
                </View>
                <View style={styles.interestTiles}>
                    { instruments.map(this.renderInterestTile) }
                </View>
            </View>
        );
    }
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = {
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
}
