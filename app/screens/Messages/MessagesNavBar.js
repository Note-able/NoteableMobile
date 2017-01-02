import React, { Component, PropTypes } from 'react';
import { View, Text, Image, TextInput, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { searchNav, listNav } from '../../actions/messagesActions';

mapStateToProps = state => ({
    search: state.messagesReducer.nav.search,
    list: state.messagesReducer.nav.list,
    name: state.messagesReducer.nav.name,
    conversation: state.messagesReducer.nav.conversation,
})

mapDispatchToProps = (dispatch) => ({
    filterUsers: () => {dispatch('find_users');},
    searchNav: () => {dispatch(searchNav());},
    listNav: () => {dispatch(listNav());},
});

class MessagesNavBar extends Component{
    state = {
        headerInputValue: '',
    }
    
    onFocus = () => {
        const {search, searchNav} = this.props;
        if(!search) {
            searchNav();
            Actions.messages_search();
        }
    }
    
    onChangeText = (text) => {
        this.setState({headerInputValue: text});
    }
    
    onSelectUser = () => {
        console.warn('user selected');
    }
    
    closeSearch = () => {
        const {search, listNav} = this.props;
        if(search) {
            Actions.pop();
            listNav();
        }
    }
    
    newMessage = () => {
        Actions.messages_create();
    }
    
    closeConversation = () => {
        const {conversation, listNav} = this.props;
        if(conversation) {
            listNav();
            Actions.pop();
        }
    }
    
    renderSearchListNav = () => {
        const { search } = this.props;
        const { inputValue } = this.state;
        return(
            <View style={styles.navBar}>
                { search ? null : 
                (<TouchableHighlight onPress={() => {Actions.pop()}}>
                    <Image source={require('../../img/back_arrow.png')} style={styles.navBackArrow}/>
                </TouchableHighlight>)
                }

                <TextInput
                    style={styles.navInput}
                    value={inputValue}
                    onFocus={()=>{this.onFocus();}}
                    autoFocus={search}
                    onChangeText={()=>{this.onChangeText();}}/>
                <TouchableHighlight onPress={() => {
                    if(search)
                        this.closeSearch();
                    else
                        this.newMessage();
                }}>
                    {search ? 
                    <Image source={require('../../img/close.png')} style={styles.navClose}/> :
                    <Image source={require('../../img/new_message.png')} style={styles.navNewMessage}/>}
                </TouchableHighlight>
            </View>);
    }
    
    renderConversationNav = () => {
        return(
            <View style={styles.navBar}>
                <Text style={styles.navTitle}>{this.props.name}</Text>
                <TouchableHighlight onPress={() => {this.closeConversation()}}>
                    <Image source={require('../../img/close.png')} style={styles.navClose}/>
                </TouchableHighlight>
            </View>);
    }
    
    render() {
        if(this.props.search || this.props.list) {
            return this.renderSearchListNav();
        } else if(this.props.conversation) {
            return this.renderConversationNav();
        }
        
        return null;
    }
};

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
        backgroundColor: 'white'
    },
    navBackArrow: {
        height: 30,
        width: 30,
        marginLeft: 16,
    },
    navNewMessage: {
        height: 30,
        width: 30,
        marginRight: 16,
    },
    navClose: {
        height: 30,
        width: 30,
        marginHorizontal: 16,
    },
    navTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        color: 'white'
    }
};