import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  ImagePickerIOS,
  Platform,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles';

export default class People extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello world</Text>
      </View>
    );
  }
}

const styles = {
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'blue',
  },
};
