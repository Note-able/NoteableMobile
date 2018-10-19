import { MessageActionTypes } from '../actions/ActionTypes';
import { logErrorToCrashlytics } from '../util.js';

const {
  getConversations,
  openConversation,
  sendMessage,
} = MessageActionTypes;

const messagesReducer = (state = { conversations: {} }, { type, conversation, conversations, message, error }) => {
  switch (type) {
    case openConversation.error:
    case getConversations.error:
    case sendMessage.error:
      console.log(type, error || 'failure');
      logErrorToCrashlytics(error || 'failure');
      return { ...state, isProcessing: false, error };
    case openConversation.processing:
    case getConversations.processing:
    case sendMessage.processing:
      return { ...state, isProcessing: true };
    case openConversation.success:
      conversations = { ...state.conversations };
      conversations[conversation.id].messages = conversation.messages;
      return { ...state, conversations, selectedConversationId: conversation.id };
    case getConversations.success:
      return { ...state, conversations };
    case sendMessage.success:
      conversations = { ...state.conversations };
      conversation = { ...conversations[state.selectedConversationId] };
      conversation.messages.push(message);
      conversations[conversation.id] = conversation;
      return { ...state, conversations };
    default:
      return state;
  }
};

export default messagesReducer;
