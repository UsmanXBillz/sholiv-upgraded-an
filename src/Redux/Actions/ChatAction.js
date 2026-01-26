import React, {Component} from 'react';
import {CLEAR_CHAT_DATA, UPDATE_CONVERSATION} from '../Constants';

export class ChatAction extends Component {

    static UpdateConversationsListen(payload) {
        return {type: UPDATE_CONVERSATION, payload};
    }
    static ClearChatReducer() {
        return {type: CLEAR_CHAT_DATA};
    }
  
}

export default ChatAction;