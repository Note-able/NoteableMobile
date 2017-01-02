import React, { Component, PropTypes } from 'react';
import { View, ScrollView, Text, TextInput, Image, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { sendMessage } from '../../actions/messagesActions';

mapStateToProps = (state) => ({
    conversation: state.messagesReducer.selectedConversation,
    userId: 123,
});

mapDispatchToProps = (dispatch) => ({
    sendMessage: (message, userId, conversationId) => {dispatch(sendMessage(message, userId, conversationId));}
});

class Conversation extends Component {
    state = {
        message: '',
    }

    render() {
        const {userId, conversation, sendMessage} = this.props;
        return(
            <View style={styles.container}>
                <ScrollView>
                    { conversation.messages.map((message) => {
                        return message.userId === userId ? 
                            <CurrentUserMessage key={message.id} user={conversation.users[message.userId]} message={message.content}/> :
                            <OtherMessage key={message.id} user={conversation.users[message.userId]} message={message.content} />
                    }) }
                </ScrollView>
                <View style={styles.sendContainer}>
                    <TextInput style={styles.sendInput} />
                    <TouchableHighlight onPress={() => {sendMessage(this.state.message, userId, conversation.conversationId )}} >
                        <Image source={require('../../img/new_message.png')} style={styles.sendButton}/>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);

const OtherMessage = ({user, message}) => (
    <View style={styles.messageContainer}>
        <Image source={{uri: user.profileImage}} style={styles.messageImage} />
        <View style={[styles.messageContent, styles.otherMessage]}>
            <Text style={[styles.messageText, styles.otherText]}>{message}</Text>
        </View>
    </View>
);

const CurrentUserMessage = ({user, message}) => (
    <View style={styles.messageContainer}>
        <View style={[styles.messageContent, styles.currentUserMessage]}>
            <Text style={[styles.messageText, styles.currentUserText]}>{message}</Text>
        </View>
        <Image source={{uri: user.profileImage}} style={styles.messageImage} />
    </View>
);

const styles = {
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    sendContainer: {
        flex: 1,
        flexDirection: 'row',
        maxHeight: 50,
        borderTopWidth: 2,
        borderTopColor: '#3574DA',
    },
    sendButton: {
        height: 40,
        width: 40,
        marginHorizontal: 16,
    },
    sendInput: {
        flex: 1
    },
    messageContainer: {
        flex: 1,
        marginTop: 20,
        flexDirection: 'row',
    },
    messageContent: {
        flex: 1,
        borderRadius: 5,
        marginVertical: 8,
        padding: 8,
    },
    messageImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginTop: -20,
    },
    otherMessage: {
        marginRight: 32,
        marginLeft: 8,
        backgroundColor: '#D0D1D5'
    },
    currentUserMessage: {
        marginRight: 8,
        marginLeft: 32,
        backgroundColor: '#3574DA',
    },
    messageText: {
        fontSize: 16,
    },
    otherText: {
        
    },
    currentUserText: {
        color: 'white',
    }
}
