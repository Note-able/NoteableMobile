import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import Event from './Event';

export default class EventMap extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
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
    const { location, events } = this.props;
    const { selectedEvent, showEvent } = this.state;
    return (
      <View style={styles.container}>
        <MapView initialRegion={location} style={styles.map} provider={PROVIDER_GOOGLE}>
          { !events ? null : events.map((event) => {
            const { latitude, longitude } = event.location;
            const coordinate = {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            };

            return (<MapView.Marker
              key={event.id}
              coordinate={coordinate}
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
