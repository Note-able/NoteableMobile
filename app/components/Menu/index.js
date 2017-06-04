import React, { PureComponent } from 'react';

import { StyleSheet, View, TouchableHighlight, Image } from 'react-native';

export default class Menu extends PureComponent {
  render() {
    return (
      <View style={styles.menuContainer}>
        <View style={styles.buttons}>
          <TouchableHighlight style={this.props.selected === 'Recorder' ? styles.selectedOption : styles.option} onPress={() => { this.props.updateSelected('Recorder'); }}>
            <Image source={require('../../img/mic.png')} style={styles.icon} />
          </TouchableHighlight>
        </View>
        <View style={styles.buttons}>
          <TouchableHighlight style={this.props.selected === 'List' ? styles.selectedOption : styles.option} onPress={() => { this.props.updateSelected('List'); }}>
            <Image source={require('../../img/list2.png')} style={styles.icon} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
    width: windowWidth,
    height: 50,
  },
  icon: {
    width: 40,
    height: 40,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  selectedOption: {
    flex: 1,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth / 2,
  },
  option: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth / 2,
  },
});
