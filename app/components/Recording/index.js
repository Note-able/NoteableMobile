import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles.js';
import { colors } from '../../styles';

const WINDOW_WIDTH = Dimensions.get('window').width;

const Recording = props => (
  <View style={styles.rowContent}>
    <TouchableHighlight onPress={props.primaryAction} underlayColor="transparent">
      <View style={{ height: '100%', alignItems: 'center', flexDirection: 'row' }}>
        <Text style={[styles.rowTitle, styles.name, props.isPlaying ? { color: colors.green } : null]} numberOfLines={1}>{props.name}</Text>
        <Text style={styles.rowDetails} numberOfLines={1}>{props.primaryDetails}</Text>
        {WINDOW_WIDTH > 400 ? <Text style={styles.rowDetails} numberOfLines={1}>{props.secondaryDetails}</Text> : null}
      </View>
    </TouchableHighlight>
    <TouchableHighlight onPress={props.openMoreMenu}>
      <Icon name={props.isOpen ? 'keyboard-arrow-right' : 'more-horiz'} size={32} style={{ width: 32, height: 32 }} color={'#95989A'} />
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
