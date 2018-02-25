import React, { Component, PropTypes } from 'react';
import * as Animatable from 'react-native-animatable';
import {
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, gradients } from '../../styles';

export default class People extends Component {
  searchChange = (text) => {
    this.setState({
      search: text,
    });
  }

  loadMe = () => {
    this.props.navigation.navigate('Me');
  }

  render() {
    const avatarUrl = this.props.screenProps.profile != null ? this.props.screenProps.profile.avatarUrl : 'default';
    return (
      <View style={styles.container}>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.9, y: 0.9 }}
          locations={[0.1, 0.3, 0.8]}
          colors={[...gradients.blueToPurple, colors.shade0]}
          style={{ position: 'absolute', width: 800, height: 800, top: -400, left: -400, borderRadius: 400 }}
        />
        <View style={styles.header}>
          <TextInput style={styles.search} placeholder="Search users" placeholderTextColor={colors.shade90} onTextChange={this.searchChange} />
          <View style={{ flexDirection: 'row', width: 32, height: 36, position: 'absolute', top: 10, right: 20, zIndex: 2 }}>
            <LinearGradient
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 1, y: 1 }}
              locations={[0.2, 0.7]}
              colors={[...gradients.purpleToRed]}
              style={{ position: 'absolute', right: -2, top: 18, width: 36, height: 36, borderRadius: 17, zIndex: 1 }}
            />
            <TouchableOpacity style={styles.me} onPress={this.loadMe}>
              <Image source={{ uri: avatarUrl }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.shade0,
  },
  header: {
    backgroundColor: colors.shade0,
    height: 80,
    width: '100%',
    paddingTop: 20,
    shadowColor: colors.black,
    shadowOpacity: 0.8,
    shadowRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  search: {
    height: 32,
    fontSize: 16,
    backgroundColor: colors.shade10,
    width: '75%',
    marginLeft: 20,
    marginVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    color: colors.shade140,
  },
  me: {
    height: 32,
    width: 32,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: colors.shade10,
    borderRadius: 16,
    zIndex: 2,
  },
});
