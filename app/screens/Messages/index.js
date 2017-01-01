import React, { Component, PropTypes } from 'react';
import { View, Text, Image, TextInput, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import MessageList from '../../components/MessageList';
import UserSearch from '../../components/UserSearch';

const mapStateToProps = state => state;

class Messages extends Component {
    constructor(props) {
        super(props);
        // This probably isn't what the api data will look like, but it's a good start to style things
        const conversations = [
            {
                id: '1',
                users: [{
                    id: 123,
                    name: 'Ian Mundy',
                    profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
                },{
                    id: 234,
                    name: 'Sportnak',
                    profileImage: 'https://avatars.logoscdn.com/2383/5112383_large_1aed4286212c43a9ae74010dbc9a7be0.jpg',
                }],
                groupId: null,
                name: null,
                messages: [
                    {
                        id: '1',
                        content: 'The assyrian came down like a wolf on the fold', 
                        user: {   
                            name: 'Ian Mundy',
                            profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
                        }, 
                    },
                    {
                        id: '2',
                        content: 'The assyrian came down like a wolf on the fold', 
                        user: {   
                            name: 'Sportnak',
                            profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
                        }, 
                    },
                    {
                        id: '3',
                        content: 'The assyrian came down like a wolf on the fold', 
                        user: {   
                            name: 'Ian Mundy',
                            profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
                        }, 
                    },
                ]
            },
        ];
        this.state = {
            conversations: conversations.reduce((map, c) => {
                map[c.id] = c;
                return map;
            }, {}),
            userId: 123,
        }
    }
    
    onHeaderInputFocus = () => {
        this.setState({userSearch: true});
    }
    
    onHeaderInputTextChange = (text) => {
        this.setState({headerInputValue: text});
    }
    
    onSelectUser = () => {
        console.warn('user selected');
    }
    
    render() {
        return (
            <View style={styles.container}>
                <MessagesHeader
                    onFocus={this.onHeaderInputFocus}
                    onChangeText={this.onHeaderInputTextChange}
                    inputValue={this.state.headerInputValue}
                    focused={this.state.userSearch}
                    closeSearch={() => {this.setState({userSearch: false});}}
                    newMessage={() => {console.warn('new message');}}/>
                {this.state.userSearch ?
                <UserSearch users={users} handleUserPress={this.onSelectUser} />:
                <MessageList conversations={this.state.conversations} userId={this.state.userId} />}
            </View>
        );
    }
}

export default connect(mapStateToProps, null)(Messages);

const MessagesHeader = ({onFocus, onChangeText, inputValue, focused, closeSearch, newMessage}) => (
    <View style={styles.navBar}>
        { focused ? null : 
        (<TouchableHighlight onPress={() => {Actions.pop()}}>
            <Image source={require('../../img/back_arrow.png')} style={styles.navBackArrow}/>
        </TouchableHighlight>)
        }

        <TextInput
            style={styles.navInput}
            value={inputValue}
            onFocus={()=>{onFocus();}} 
            onChangeText={()=>{onChangeText();}}/>
        <TouchableHighlight onPress={() => {
            if(focused)
                closeSearch();
            else
                newMessage();
        }}>
            {focused ? 
            <Image source={require('../../img/close.png')} style={styles.navClose}/> :
            <Image source={require('../../img/new_message.png')} style={styles.navNewMessage}/>}
        </TouchableHighlight>
    </View>
);

const styles = {
    container: {
        flex: 1,
    },
    navBar: {
        top: 0,
        right: 0,
        left: 0,
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
    }
};

const users = {
    123: {
        id: 123,
        name: 'Ian Mundy',
        profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
    },
    234: {
        id: 234,
        name: 'Sportnak',
        profileImage: 'https://avatars.logoscdn.com/2383/5112383_large_1aed4286212c43a9ae74010dbc9a7be0.jpg',
    },
};
