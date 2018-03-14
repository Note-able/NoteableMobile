
import { MessageActionTypes } from './ActionTypes';
import { fetchUtil } from '../util';

export const sendMessage = (user, conversationId, content) => async (dispatch) => {
  const message = await postMessage(user, conversationId, content);
  dispatch({ type: MessageActionTypes.sendMessage, message });
};

export const getConversations = currentUser => async (dispatch) => {
  const conversations = await fetchConversations(currentUser);
  const conversationsByUserId = conversations.reduce((map, c) => {
    const users = [...c.users].reduce((userMap, user) => { userMap[user.id] = user; return userMap; }, {});
    c.users = users;
    map[c.id] = c;
    return map;
  }, {});
  dispatch({ type: MessageActionTypes.getConversations, conversations: conversationsByUserId });
};

export const openConversation = (currentUser, conversationId) => async (dispatch) => {
  const conversation = await fetchConversation(currentUser, conversationId);
  const users = conversation.users.reduce((map, user) => { map[user.id] = user; return map; }, {});
  conversation.users = users;
  dispatch({ type: MessageActionTypes.openConversation, conversation });
};

const fetchConversation = (user, id) => fetchUtil.get({ url: `https://beta.noteable.me/api/v1/conversations/${id}`, auth: user.jwt })
.then(response => response.json());

const fetchConversations = user => fetchUtil.get({ url: 'https://beta.noteable.me/api/v1/conversations', auth: user.jwt })
.then(response => response.json());

const postMessage = (user, conversationId, content) => fetchUtil.postWithBody({
  url: 'https://beta.noteable.me/api/v1/messages',
  auth: user.jwt,
  body: {
    userId: user.id,
    conversationId,
    content,
  },
})
.then(response => response.json())
.then(({ messageId }) => ({ id: messageId, userId: user.id, conversationId, content }));
