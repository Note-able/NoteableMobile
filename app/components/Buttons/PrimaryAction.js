import React, { PropTypes } from 'react';
import { TouchableHighlight, Text } from 'react-native';

import { colors } from '../../styles';

// TODO need to pass through height+width OR flex properties

const PrimaryAction = ({ onPress, text, color, width, height }) => (
  <TouchableHighlight onPress={onPress} style={[styles.buttonContainer, { backgroundColor: color, width, height }]}>
    <Text style={styles.text}>{text}</Text>
  </TouchableHighlight>
);

PrimaryAction.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default PrimaryAction;

const styles = {
  buttonContainer: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: colors.white,
  },
};
