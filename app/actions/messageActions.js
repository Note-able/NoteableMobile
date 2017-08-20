
import { MessageActionTypes } from './ActionTypes';
import { fetchUtil } from '../util';

export const sendMessage = (user, conversationId, content) => (dispatch) => {
  postMessage(user, conversationId, content).then((message) => {
    dispatch({ type: MessageActionTypes.sendMessage, message });
  });
};

export const searchNav = () => ({ type: MessageActionTypes.searchMessages });

export const listNav = () => ({ type: MessageActionTypes.listMessages });

export const getConversations = currentUser => (dispatch) => {
  fetchConversations(currentUser).then((conversations) => {
    conversations = conversations.reduce((map, c) => {
      const users = [...c.users].reduce((userMap, user) => { userMap[user.id] = user; return userMap; }, {});
      c.users = users;
      map[c.id] = c;
      return map;
    }, {});
    dispatch({ type: MessageActionTypes.getConversations, conversations });
  });
};

export const openConversation = (currentUser, userId, conversationId) => (dispatch) => {
  fetchConversation(currentUser, conversationId).then((conversation) => {
    const users = conversation.users.reduce((map, user) => { map[user.id] = user; return map; }, {});
    conversation.users = users;
    const userName = `${users[userId].firstName} ${users[userId].lastName}`;
    dispatch({ type: MessageActionTypes.openConversation, conversation, userName });
  });
};

const fetchConversation = (user, id) => fetchUtil.get({ url: `http://beta.noteable.me/api/v1/conversation/${id}`, auth: user.jwt })
.then(response => response.json());

const fetchConversations = user => fetchUtil.get({ url: 'http://beta.noteable.me/api/v1/conversations', auth: user.jwt })
.then(response => response.json());

const postMessage = (user, conversationId, content) => fetchUtil.postWithBody({
  url: 'http://beta.noteable.me/api/v1/messages',
  auth: user.jwt,
  body: {
    userId: user.id,
    conversationId,
    content,
  },
})
.then(response => response.json())
.then(({ messageId }) => ({ id: messageId, userId: user.id, conversationId, content }));
