import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { connect } from 'react-redux';

import Event from './Event';

mapStateToProps = (state) => ({
    location: state.eventsReducer.location,
});

mapDispatchToProps = (dispatch) => ({
    changeLocation: () => {console.warn('changeLocation');},
});

class EventList extends Component {
    render() {
        const { location, changeLocation, events } = this.props;
        return (
            <ScrollView style={{flex: 1}}>
                <View style={styles.container}>
                    {
                        !events ? null : events.map((event) => (
                            <Event key={event.id} containerStyles={{marginVertical: 4}} event={event} />
                        )) 
                    }
                </View>
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventList);

const styles = {
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
}
