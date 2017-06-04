import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';

import Event from './Event';

export default class EventList extends Component {
  render() {
    const { location, events } = this.props;
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          {
            !events ? null : events.map((event) => (
              <Event key={event.id} containerStyles={{ marginVertical: 4 }} event={event} />
            ))
          }
        </View>
      </ScrollView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
