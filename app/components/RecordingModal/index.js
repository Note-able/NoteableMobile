import React, { PropTypes, Component } from 'react';
import {
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import styles from './styles';

export default class RecordingModal extends Component {
  static props = {
    cancel: PropTypes.func.isRequired,
    cancelText: PropTypes.string.isRequired,
    initialValue: PropTypes.string,
    save: PropTypes.func.isRequired,
  };

  state = {
    fileName: this.props.initialFileName || '',
    tags: this.props.initialTags || '',
  };

  render() {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Title</Text>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput style={styles.inputField} onChangeText={name => this.setState({ fileName: name })} value={this.state.fileName} underlineColorAndroid="transparent" />
          <Text style={styles.inputLabel}>Tags</Text><Text style={[styles.inputLabel, { fontSize: 10 }]}>(comma separated)</Text>
          <TextInput style={styles.inputField} onChangeText={tags => this.setState({ tags })} value={this.state.tags} underlineColorAndroid="transparent" />
          <View style={styles.buttonRow}>
            <TouchableHighlight style={styles.buttonOption} onPress={this.props.cancel}>
              <Text style={{ textAlign: 'center', color: '#95989A', fontSize: 16 }}>{this.props.cancelText}</Text>
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
