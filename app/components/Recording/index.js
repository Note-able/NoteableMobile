import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Text, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles.js';
import { colors } from '../../styles';

const WINDOW_WIDTH = Dimensions.get('window').width;

const Recording = ({
  primaryAction,
  name,
  primaryDetails,
  secondaryDetails,
  openMoreMenu,
  isOpen,
  isPlaying,
}) => (
  <View style={styles.rowContent}>
    <TouchableHighlight onPress={primaryAction} underlayColor="transparent">
      <View style={{ height: '100%', alignItems: 'center', flexDirection: 'row' }}>
        <Text
          style={[styles.rowTitle, styles.name, isPlaying ? { color: colors.green } : null]}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text style={styles.rowDetails} numberOfLines={1}>
          {primaryDetails}
        </Text>
        {WINDOW_WIDTH > 400 ? (
          <Text style={styles.rowDetails} numberOfLines={1}>
            {secondaryDetails}
          </Text>
        ) : null}
      </View>
    </TouchableHighlight>
    <TouchableHighlight onPress={openMoreMenu}>
      <Icon
        name={isOpen ? 'keyboard-arrow-right' : 'more-horiz'}
        size={32}
        style={{ width: 32, height: 32 }}
        color={'#95989A'}
      />
    </TouchableHighlight>
  </View>
);

Recording.propTypes = {
  name: PropTypes.string.isRequired,
  openMoreMenu: PropTypes.func.isRequired,
  primaryAction: PropTypes.func.isRequired,
  primaryDetails: PropTypes.string,
  secondaryDetails: PropTypes.string,
  isOpen: PropTypes.bool,
  isPlaying: PropTypes.bool,
};

export default Recording;
