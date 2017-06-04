import { fetchUtil, logErrorToCrashlytics } from '../util';

export const sendMessage = (user, conversationId, content) => (
  (dispatch) => {
    postMessage(user, conversationId, content, (message) => {
      dispatch({ type: 'MESSAGES/SEND_MESSAGE', message });
    });
  }
);

export const searchNav = () => ({ type: 'HEADER_SEARCH' });

export const listNav = () => ({ type: 'HEADER_LIST' });

export const getConversations = currentUser => (
  (dispatch) => {
    fetchConversations(currentUser, (data) => {
      const conversations = data.reduce((map, c) => {
        const conversation = { ...c };
        conversation.users = [...c.users].reduce((users, user) => { users[user.id] = user; return users; }, {});
        map[conversation.id] = conversation;
        return map;
      }, {});
      dispatch({ type: 'MESSAGES/GET_CONVERSATIONS', conversations });
    });
  }
);

export const openConversation = (currentUser, userId, conversationId) => (
  (dispatch) => {
    fetchConversation(currentUser, conversationId, (conversation) => {
      const users = conversation.users.reduce((map, user) => { map[user.id] = user; return map; }, {});
      conversation.users = users;
      const userName = `${users[userId].firstName} ${users[userId].lastName}`;
      dispatch({ type: 'MESSAGES/OPEN_CONVERSATION', conversation, userName });
    });
  }
);

const fetchConversation = (user, id, next) => (
  fetchUtil.get({
    url: `http://beta.noteable.me/conversation/${id}`,
    auth: user.jwt,
  })
  .then(response => response.json())
  .then((conversation) => {
    next(conversation);
  })
  .catch(error => logErrorToCrashlytics(error))
);

const fetchConversations = (user, next) => (
  fetchUtil.get({
    url: 'http://beta.noteable.me/conversations',
    auth: user.jwt,
  })
  .then(response => response.json())
  .then((conversations) => {
    next(conversations);
  })
  .catch(error => logErrorToCrashlytics(error))
);

const postMessage = (user, conversationId, content, next) => (
  fetchUtil.postWithBody({
    url: 'http://beta.noteable.me/messages',
    auth: user.jwt,
    body: {
      userId: user.id,
      conversationId,
      content,
    },
  })
  .then(response => response.json())
  .then(({ messageId }) => {
    next({ id: messageId, userId: user.id, conversationId, content });
  })
  .catch(error => logErrorToCrashlytics(error))
);
