import React, { Component, PropTypes } from 'react';
import { View, Text, Image, TextInput, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import MessageList from '../../components/MessageList';
import UserSearch from '../../components/UserSearch';

const mapStateToProps = state => state;

class MessagesSearch extends Component {
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
    
    onSelectUser = () => {
        console.warn('user selected');
    }
    
    render() {
        return (
            <View style={styles.container}>
                <UserSearch users={users} handleUserPress={this.onSelectUser} />
            </View>
        );
    }
}

export default connect(mapStateToProps, null)(MessagesSearch);

const styles = {
    container: {
        flex: 1,
        marginTop: 45,
    },
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
