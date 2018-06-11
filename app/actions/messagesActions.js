
import { MessageActionTypes } from './ActionTypes';
import { fetchUtil } from '../util';
import { apiBaseUrl } from '../settings.json';

export const sendMessage = (user, conversationId, content) => async (dispatch) => {
  dispatch({ type: MessageActionTypes.sendMessage.processing });
  const message = await postMessage(user, conversationId, content);
  dispatch({ type: MessageActionTypes.sendMessage.success, message });
};

export const getConversations = currentUser => async (dispatch) => {
  dispatch({ type: MessageActionTypes.getConversations.processing });
  const conversations = await fetchConversations(currentUser);
  const conversationsByUserId = conversations.reduce((map, c) => {
    const users = [...c.users].reduce((userMap, user) => { userMap[user.id] = user; return userMap; }, {});
    c.users = users;
    map[c.id] = {
      conversationId: c.id,
      users,
      lastMessage: { ...c.lastMessage },
    };
    return map;
  }, {});
  dispatch({ type: MessageActionTypes.getConversations.success, conversations: conversationsByUserId });
};

export const openConversation = (currentUser, conversationId) => async (dispatch) => {
  dispatch({ type: MessageActionTypes.openConversation.processing });
  const conversation = await fetchConversation(currentUser, conversationId);
  const users = conversation.users.reduce((map, user) => { map[user.id] = user; return map; }, {});
  conversation.users = users;
  dispatch({ type: MessageActionTypes.openConversation.success, conversation });
};

const fetchConversation = (user, id) => fetchUtil.get({ url: `${apiBaseUrl}/conversations/${id}`, auth: user.jwt })
.then(response => response.json());

const fetchConversations = user => fetchUtil.get({ url: `${apiBaseUrl}/conversations`, auth: user.jwt })
.then(response => response.json());

const postMessage = (user, conversationId, content) => fetchUtil.postWithBody({
  url: `${apiBaseUrl}/messages`,
  auth: user.jwt,
  body: {
    userId: user.id,
    conversationId,
    content,
  },
})
.then(response => response.json())
.then(({ messageId }) => ({ id: messageId, userId: user.id, conversationId, content }));
