import React, {Component} from 'react';
import { View, ScrollView, Text, Image, TextInput, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import EventCard from '../../components/Nearby/EventCard';
import JamCard from '../../components/Nearby/JamCard';
import JoinedCard from '../../components/Nearby/JoinedCard';
import SongCard from '../../components/Nearby/SongCard';
import { getNearby } from '../../actions/newsFeedActions';

const EVENT_TYPE = 'EVENT';
const JAM_TYPE = 'JAM';
const JOINED_TYPE = 'JOINED';
const SONG_TYPE = 'SONG';

mapStateToProps = state => ({
    events: state.newsFeedReducer.events,
});

mapDispatchToProps = (dispatch) => ({
    getEvents: () => { dispatch(getNearby()); },
});

class Nearby extends Component {
    renderCard(card) {
        switch(card.type) {
            case EVENT_TYPE:
                return (<EventCard key={card.id} card={card}/>)
            case JAM_TYPE:
                return (<JamCard key={card.id} card={card}/>)
            case JOINED_TYPE:
                return (<JoinedCard key={card.id} card={card}/>)
            case SONG_TYPE:
                return (<SongCard key={card.id} card={card}/>)
            default:
            return null;
        }
    }
    
    componentDidMount() {
        this.props.getEvents();
    }
    
    render() {
        const {events} = this.props;

        return (
            <View style={styles.container}>
                <NearbyHeader />
                <ScrollView>
                    { events.map((card) => this.renderCard(card)) }
                </ScrollView>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nearby);

const NearbyHeader = () => (
    <View style={styles.navBar}>        
        <TouchableHighlight onPress={() => { Actions.pop(); }}>
            <Image source={require('../../img/back_arrow.png')} style={styles.navBackArrow}/>
        </TouchableHighlight>
        <TextInput style={styles.navInput} />
        <TouchableHighlight onPress={() => {}}>
            <Text style={styles.navTitle}>Most Recent</Text>
        </TouchableHighlight>
    </View>);

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    navBar: {
        top: 0,
        right: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#31CB94',
        height: 50,
    },
    navTitle: {
        padding: 10,
        color: 'white',
        fontSize: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    navBackArrow: {
        flex: 1,
        maxHeight: 30,
        maxWidth: 30,
        marginLeft: 16,
    },
    navInput: {
        flex: 5,
    },
    navDropDown: {
        flex: 2,
        marginHorizontal: 16,
    }
}
