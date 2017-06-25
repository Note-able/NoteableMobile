import React, { PropTypes, Component } from 'react';
import {
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import styles from './styles';

export default class CustomModal extends Component {
  static props = {
    cancel: PropTypes.func.isRequired,
    initialValue: PropTypes.string,
    save: PropTypes.func.isRequired,
  };

  state = {
    fileName: this.props.initialValue,
    tags: '',
  };

  render() {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Title</Text>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput style={styles.inputField} onChangeText={name => this.setState({ fileName: name })} value={this.state.fileName} />
          <Text style={styles.inputLabel}>Tags</Text>
          <TextInput style={styles.inputField} onChangeText={tags => this.setState({ tags })} value={this.state.tags} />
          <View style={styles.buttonRow}>
            <TouchableHighlight style={styles.buttonOption} onPress={this.props.cancel}>
              <Text style={{ textAlign: 'center', color: '#95989A', fontSize: 16 }}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.buttonOption} onPress={() => this.props.save(this.state)}>
              <Text style={{ textAlign: 'center', color: '#95989A', fontSize: 16 }}>Save</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}