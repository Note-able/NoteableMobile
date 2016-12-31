import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';

class Messages extends Component {
    constructor(props) {
        super(props);
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
                    profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
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
            }
        ];
        this.state = {
            conversations: conversations.reduce((map, c) => {
                return map[c.id] = c;
            }, {}),
            userId: 123,
        }
    }
    
    render() {
        
    }
}
