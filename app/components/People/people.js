import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import {
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableHighlight,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, gradients } from '../../styles';

export default class People extends Component {
  static propTypes = {
    screenProps: PropTypes.shape({
      searchProfiles: PropTypes.func.isRequired,
      loadProfile: PropTypes.func.isRequired,
    }),
  }

  state = {
    search: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.visibleProfile != null && !this.state.update) {
      this.setState({
        update: true,
      });
      this.props.navigation.navigate('Me');
    }

    this.setState({
      search: nextProps.screenProps.search,
    });
  }

  viewProfile = (userId) => {
    this.props.screenProps.loadProfile(userId);
    this.setState({
      update: false,
    });
  }

  search = async () => {
    if (this.timeout != null) {
      clearTimeout(this.timeout);
    }

    if (this.state.query.trim() !== '') {
      this.timeout = setTimeout(() => this.props.screenProps.searchProfiles(this.state.query), 400);
    }
  }

  searchChange = (text) => {
    this.setState({
      query: text,
    }, this.search);
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
          <TextInput style={styles.search} placeholder="Search users" placeholderTextColor={colors.shade90} onChangeText={this.searchChange} />
          <View style={{ flexDirection: 'row', width: 32, height: 36, position: 'absolute', top: 10, right: 20, zIndex: 2 }}>
            <LinearGradient
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 1, y: 1 }}
              locations={[0.2, 0.7]}
              colors={[...gradients.purpleToRed]}
              style={{ position: 'absolute', right: -2, top: 18, width: 36, height: 36, borderRadius: 17, zIndex: 1 }}
            />
            <TouchableOpacity style={styles.me} onPress={this.loadMe}>
              <Image source={{ uri: avatarUrl }} style={{ width: 32, height: 32, borderRadius: 16 }} />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          contentContainerStyle={styles.results}
          bounces
          data={(this.state.search != null && this.state.search.results) || []}
          getItemLayout={(data, index) => (
            { length: 60, offset: 60 * index, index }
          )}
          initialNumToRender={12}
          refreshing={false}
          removeClippedSubviews={false}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => (
            <TouchableHighlight key={item.id} onPress={() => this.viewProfile(item.id)}>
              <View style={styles.result}>
                {item.avatar_url ? <Image style={styles.avatar} source={{ uri: item.avatar_url }} /> : <Icon name="account-circle" size={32} style={{ width: 32, height: 32, marginRight: 12 }} color="white" />}
                <Text style={styles.text}>{item.fullname}</Text>
              </View>
            </TouchableHighlight>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  results: {
    position: 'absolute',
    width: '100%',
    backgroundColor: colors.shade0,
  },
  avatar: {
    width: 32,
    height: 32,
    marginRight: 12,
    borderRadius: 16,
  },
  result: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.shade60,
  },
  text: {
    color: colors.shade90,
    fontSize: 16,
  },
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
