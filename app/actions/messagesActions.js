
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
