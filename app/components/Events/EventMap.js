import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import Event from './Event';

const mapStateToProps = state => ({
  location: state.eventsReducer.location,
});

const mapDispatchToProps = dispatch => ({
  changeLocation: () => { console.warn('changeLocation'); },
});

class EventMap extends Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.object),
  }

  state = {
    showEvent: false,
    selectedEvent: null,
  }

  handleMarkerPress = (event) => {
    this.setState({ selectedEvent: event, showEvent: true });
  }

  closeEvent = () => {
    this.setState({ showEvent: false });
  }

  render() {
    const { location, changeLocation, events } = this.props;
    const { selectedEvent, showEvent } = this.state;
    return (
      <View style={styles.container}>
        <MapView initialRegion={location} style={styles.map} provider={PROVIDER_GOOGLE}>
          { !events ? null : events.map((event) => {
            const { latitude, longitude } = event.location;
            const location = {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            };

            return (<MapView.Marker
              key={event.id}
              coordinate={location}
              title={event.title}
              onPress={() => { this.handleMarkerPress(event); }}
            />);
          }) }
        </MapView>
        { showEvent ? <Event containerStyles={styles.selectedEvent} event={selectedEvent} closeEvent={this.closeEvent} /> : null }
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventMap);

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  selectedEvent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
};
