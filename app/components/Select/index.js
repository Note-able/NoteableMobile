import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, ScrollView, View, Text, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

export default class Select extends PureComponent {
  static propTypes = {
    selectedValue: PropTypes.shape({
      value: PropTypes.string.isRequired,
      display: PropTypes.string.isRequired,
    }),
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        display: PropTypes.string.isRequired,
      })
    ),
    onValueChange: PropTypes.func.isRequired,
  };

  state = {
    visible: false,
  };

  handleValueChange = value => {
    this.setState({ visible: false });
    this.props.onValueChange(value);
  };

  render() {
    const { visible } = this.state;
    const { options, selectedValue } = this.props;

    return (
      <TouchableOpacity onPress={() => this.setState({ visible: true })}>
        <View style={styles.selectContainer}>
          <Text style={styles.selectText}>{selectedValue.display}</Text>
          <Icon name="keyboard-arrow-down" size={20} color={'white'} />
          <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modal}>
              <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.modalItems}>
                {options.map(option => (
                  <TouchableOpacity
                    style={{ width: '100%' }}
                    key={option.value}
                    onPress={() => this.handleValueChange(option)}
                  >
                    <Text style={styles.modalItem}>{option.display}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Modal>
        </View>
      </TouchableOpacity>
    );
  }
}
