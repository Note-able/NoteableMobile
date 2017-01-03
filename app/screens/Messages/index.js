import React, { Component, PropTypes } from 'react';
import { View, Text, Image, TextInput, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { openConversation } from '../../actions/messagesActions';
import MessageList from '../../components/MessageList';

const mapStateToProps = state => state;

mapDispatchToProps = (dispatch) => ({
    openConversation: (currentUserId, userId, conversationId) => {dispatch(openConversation(currentUserId, userId, conversationId));},
})

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
    
    selectConversation = (conversationId, userId) => {
        const {openConversation} = this.props;
        openConversation(this.state.userId, userId, conversationId);
        Actions.messages_conversation();
    }
    
    render() {
        return (
            <View style={styles.container}>
                <MessageList conversations={this.state.conversations} userId={this.state.userId} onSelectConversation={this.selectConversation} />
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);

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
