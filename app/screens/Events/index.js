import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Image } from 'react-native';
import { connect } from 'react-redux';

import EventList from '../../components/Events/EventList';
import EventMap from '../../components/Events/EventMap';

import { getEvents } from '../../actions/eventActions';

const mapDispatchToProps = dispatch => ({
  getEventsAction: () => dispatch(getEvents()),
});

const mapStateToProps = state => ({
  events: state.eventsReducer.events,
  location: state.eventsReducer.location,
});

class Events extends Component {
  state = {
    mapView: true,
  }

  componentDidMount() {
    const { getEventsAction } = this.props;
    getEventsAction();
  }

  showList = () => {
    this.setState({ mapView: false });
  }

  showMap = () => {
    this.setState({ mapView: true });
  }

  render() {
    const { events, location } = this.props;
    return (
      <View style={styles.container}>
        <EventsHeader showList={this.showList} showMap={this.showMap} />
        {this.state.mapView ? <EventMap events={events} location={location} /> : <EventList events={events} location={location} />}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Events);

const EventsHeader = ({ showList, showMap }) => (
  <View style={styles.navBar}>
    <TouchableHighlight /*onPress={() => { Actions.pop(); }}*/>
      <Image source={require('../../img/back_arrow.png')} style={styles.navBackArrow} />
    </TouchableHighlight>
    <TouchableHighlight style={styles.navTitleHighlight} onPress={() => { showMap(); }}>
      <Text style={styles.navTitle}>Map</Text>
    </TouchableHighlight>
    <TouchableHighlight style={styles.navTitleHighlight} onPress={() => { showList(); }}>
      <Text style={styles.navTitle}>List</Text>
    </TouchableHighlight>
    <TouchableHighlight /*onPress={() => { Actions.pop(); }}*/>
      <Image source={require('../../img/plus.png')} style={styles.navClose} />
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
    backgroundColor: '#F0A63E',
    height: 50,
  },
  navTitleHighlight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    color: 'white',
    fontSize: 22,
  },
  navBackArrow: {
    height: 30,
    width: 30,
    marginLeft: 16,
  },
  navClose: {
    height: 30,
    width: 30,
    marginRight: 16,
  },
};
