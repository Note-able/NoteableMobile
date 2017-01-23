
//this will be a thunk eventually
export const sendMessage = (user, conversationId, content) => {
    return (dispatch) => {
        postMessage(user, conversationId, content, (message) => {
            dispatch({type: 'MESSAGES/SEND_MESSAGE', message});
        })
    }
}

export const searchNav = () => {
    return {type: 'HEADER_SEARCH'}
}

export const listNav = () => {
    return {type: 'HEADER_LIST'}
}

export const getConversations = (currentUser) => {
    return (dispatch) => {
        fetchConversations(currentUser, (conversations) => {
            conversations = conversations.reduce((map, c) => { 
                const users = [ ...c.users ].reduce((users, user) => { users[user.id] = user; return users; }, {});
                c.users = users;
                map[c.id] = c;
                return map; 
            }, {});
            dispatch({ type: 'MESSAGES/GET_CONVERSATIONS', conversations });
        })
    }
};

export const openConversation = (currentUser, userId, conversationId) => {
    return (dispatch) => {
        fetchConversation(currentUser, conversationId, (conversation) => {
            const users = conversation.users.reduce((map, user) => {map[user.id] = user; return map;}, {});
            conversation.users = users;
            const userName = `${users[userId].firstName} ${users[userId].lastName}`;
            dispatch({ type: 'MESSAGES/OPEN_CONVERSATION', conversation, userName });
        })
    }
};

const fetchConversation = (user, id, next) => {
    return fetch(`http://beta.noteable.me/conversation/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': user.jwt,
        },
    })
    .then((response) => { return response.json(); })
    .then((conversation) => {
        next(conversation);
    })
}

const fetchConversations = (user, next) => {
    return fetch(`http://beta.noteable.me/conversations`, {
        method: 'GET',
        headers: {
            'Authorization': user.jwt,
        },
    })
    .then((response) => {
        return response.json();
    })
    .then((conversations) => {
        next(conversations);
    })
    .catch(error => console.warn(error))
}

const postMessage = (user, conversationId, content, next) => {
    return fetch(`http://beta.noteable.me/messages`, {
        method: 'POST',
        headers: {
            'Authorization': user.jwt,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: user.id,
            conversationId,
            content
        }),
    })
    .then((response) => {
        return response.json();
    })
    .then(({messageId}) => {
        next({ id: messageId, userId: user.id, conversationId, content });
    })
}
