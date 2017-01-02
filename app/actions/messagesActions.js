
//this will be a thunk eventually
export const sendMessage = (message, userId, conversationId) => {
    console.warn(`send ${message}`);
    return {type: 'SEND_MESSAGE', content: message, userId, conversationId};
}

export const searchNav = () => {
    return {type: 'HEADER_SEARCH'}
}

export const listNav = () => {
    return {type: 'HEADER_LIST'}
}

//faking a thunk here to return data...
export const openConversation = (currentUserId, userId, conversationId) => {
    return (dispatch) => {
        const conversation = getConversation(userId, conversationId);
        const users = conversation.users.reduce((map, user) => {map[user.id] = user; return map;}, {});
        conversation.users = users;
        const userName = users[userId].name;
        dispatch({type: 'OPEN_CONVERSATION', conversation, userName});
    }
}

const getConversation = (userId, conversationId) => {
    return {
        conversationId: 1,
        users: [{
                id: 123,
                name: 'Ian Mundy',
                profileImage: 'https://en.gravatar.com/userimage/68360943/7295595f4b0523e5e4442c022fc60352.jpeg',
            },{
                id: 234,
                name: 'Sportnak',
                profileImage: 'https://avatars.logoscdn.com/2383/5112383_large_1aed4286212c43a9ae74010dbc9a7be0.jpg',
            }],
        messages: [
            {
                id: '1',
                content: 'The assyrian came down like a wolf on the fold', 
                userId: 123,
            },
            {
                id: '2',
                content: 'The assyrian came down like a wolf on the fold', 
                userId: 234,
            },
            {
                id: '3',
                content: 'The assyrian came down like a wolf on the fold', 
                userId: 123,
            }],
    }
}
