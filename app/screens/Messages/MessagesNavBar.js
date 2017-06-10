import React, { Component } from 'react';
import { View, Text, TextInput, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { searchNav, listNav } from '../../actions/messagesActions';

const mapStateToProps = state => ({
  search: state.messagesReducer.nav.search,
  list: state.messagesReducer.nav.list,
  name: state.messagesReducer.nav.name,
  conversation: state.messagesReducer.nav.conversation,
});

const mapDispatchToProps = dispatch => ({
  filterUsers: () => { dispatch('find_users'); },
  searchNav: () => { dispatch(searchNav()); },
  listNav: () => { dispatch(listNav()); },
});

class MessagesNavBar extends Component {
  state = {
    headerInputValue: '',
  }

  onFocus = () => {
    const { search, searchNav } = this.props;
    if (!search) {
      searchNav();
      // Actions.messages_search();
    }
  }

  onChangeText = (text) => {
    this.setState({ headerInputValue: text });
  }

  onSelectUser = () => {
    console.warn('user selected');
  }

  closeSearch = () => {
    const { search, listNav } = this.props;
    if (search) {
      // Actions.pop();
      listNav();
    }
  }

  newMessage = () => {
    // Actions.messages_create();
  }

  closeConversation = () => {
    const { conversation, listNav } = this.props;
    if (conversation) {
      listNav();
      // Actions.pop();
    }
  }

  renderSearchListNav = () => {
    const { search } = this.props;
    const { inputValue } = this.state;
    return (
      <View style={styles.navBar}>
        { search ? null :
        (<TouchableHighlight /*onPress={() => { Actions.pop(); }}*/>
          <Icon name="keyboard-arrow-left" style={styles.navBackArrow} color="#FFF" />
        </TouchableHighlight>)
        }

        <TextInput
          style={styles.navInput}
          value={inputValue}
          onFocus={() => { this.onFocus(); }}
          autoFocus={search}
          onChangeText={() => { this.onChangeText(); }} />
        <TouchableHighlight
          onPress={() => {
            if (search) {
              this.closeSearch();
            } else {
              this.newMessage();
            }
          }}
        >
          { search ?
            <Icon name="close" style={styles.navClose} color="#FFF" /> :
            <Icon name="chat" style={styles.navNewMessage} color="#FFF" />}
        </TouchableHighlight>
      </View>);
  }

  renderConversationNav = () => (
    <View style={styles.navBar}>
      <Text style={styles.navTitle}>{this.props.name}</Text>
      <TouchableHighlight onPress={() => { this.closeConversation(); }} >
        <Icon name="close" style={styles.navClose} color="#FFF" />
      </TouchableHighlight>
    </View>
  );

  render() {
    if (this.props.search || this.props.list) {
      return this.renderSearchListNav();
    } else if (this.props.conversation) {
      return this.renderConversationNav();
    }

    return null;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesNavBar);

const styles = {
  container: {
    flex: 1,
  },
  navBar: {
    top: 0,
    right: 0,
    left: 0,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3574DA',
    height: 45,
  },
  navInput: {
    flex: 1,
    height: 30,
    paddingVertical: 0,
    paddingHorizontal: 4,
    marginHorizontal: 8,
    backgroundColor: 'white',
  },
  navBackArrow: {
    height: 40,
    width: 40,
    fontSize: 40,
  },
  navNewMessage: {
    height: 30,
    width: 30,
    fontSize: 30,
    marginRight: 16,
  },
  navClose: {
    height: 30,
    width: 30,
    fontSize: 30,
    marginHorizontal: 16,
  },
  navTitle: {
    marginLeft: 62,
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
};
