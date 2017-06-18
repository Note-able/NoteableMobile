import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles.js';

const Recording = props => (
  <View style={styles.rowContent}>
    <TouchableHighlight onPress={props.primaryAction} underlayColor="transparent">
      <View style={{ height: '100%', alignItems: 'center', flexDirection: 'row' }}>
        <Text style={[styles.rowTitle, styles.name]} numberOfLines={1}>{props.name}</Text>
        <Text style={styles.rowTitle} numberOfLines={1}>{props.primaryDetails}</Text>
      </View>
    </TouchableHighlight>
    <TouchableHighlight onPress={props.openMoreMenu}>
      <Icon name="more-horiz" size={32} style={{ width: 32, height: 32, margin: 10 }} color={'#95989A'} />
    </TouchableHighlight>
  </View>
);

Recording.propTypes = {
  name: PropTypes.string.isRequired,
  openMoreMenu: PropTypes.func.isRequired,
  primaryAction: PropTypes.func.isRequired,
  primaryDetails: PropTypes.string,
};

export default Recording;
