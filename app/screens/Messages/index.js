import React, { Component, PropTypes } from 'react';
import { View, Text, Image, TextInput, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { getConversations as fetchConversations, openConversation } from '../../actions/messagesActions';
import MessageList from '../../components/MessageList';

const mapStateToProps = state => ({
    user: state.userReducer.user,
    conversations: state.messagesReducer.conversations,
});

mapDispatchToProps = (dispatch) => ({
    openConversation: (currentUserId, userId, conversationId) => {dispatch(openConversation(currentUserId, userId, conversationId));},
    getConversations: (user) => { dispatch(fetchConversations(user)); },
})

class Messages extends Component {   
    componentDidMount() {
        this.props.getConversations(this.props.user);
    }

    selectConversation = (conversationId, userId) => {
        const { openConversation, user } = this.props;
        openConversation(user, userId, conversationId);
        Actions.messages_conversation();
    }
    
    render() {
        const { conversations = [], user } = this.props;
        return (
            <View style={styles.container}>
                <MessageList conversations={conversations} userId={user.id} onSelectConversation={this.selectConversation} />
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
