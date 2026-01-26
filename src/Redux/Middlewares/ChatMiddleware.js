import React from 'react';
import Toast from 'react-native-toast-message';
import {Store} from '..';
import {NavigationService} from '../../Config';
import ApiCaller from '../../Config/ApiCaller';
import {ToastError} from '../../Config/Helper';

export class ChatMiddleware extends React.Component {
  static CreateConversation({payload, participantData, cb}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: '/chat',
        method: 'post',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        NavigationService.navigate('ChatDetails', {
          item: response?.data?.conversation,
          participantData,
        });
        cb();
      }
    };
  }

  // this is yet to be used
  static GetConversations = ({offset, cb}) => {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/chat/conversations/?limit=10&offset=&${offset}`,

        method: 'get',
        body: {},
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        cb(response?.data?.conversations?.rows);
      }
    };
  };

  static GetMessagesPlans = cb => {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/chat/plan`,
        method: 'get',
        body: {},
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        cb(response?.data?.plan?.rows);
      }
    };
  };

  static GetMessagesPaymentLink = ({id, cb}) => {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/chat/plan/link/${id}`,
        method: 'get',
        body: {},
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        cb(response?.data);
      }
    };
  };

  static GetMessages = ({id, offset, cb}) => {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/chat/message/${id}?limit=10&offset=${offset}`,
        method: 'get',
        body: {},
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        cb(response?.data?.messages);
      }
    };
  };

  static SendMessage = ({payload, cb}) => {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: '/chat/message',
        method: 'post',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        const {Text} = response?.data;
        cb(Text);
      } else {
        cb(false);
      }
    };
  };

  //upload attachment
  static UploadAttachment = ({
    conversation_id,
    UploadType,
    type,
    payload,
    cb,
  }) => {
    return async dispatch => {
      const endPoint = `/uploads?uploadType=${UploadType}&type=${type}`;
      dispatch(LoaderAction.LoaderTrue());

      try {
        const responseData = await ApiCaller.UploadFile(
          endPoint,
          payload,
          {conversation_id},
          dispatch,
        );
        if (responseData?.result[0]?.Location) {
          let urls = responseData?.result?.map(val => ({
            url: val?.Location,
            file_name: val?.fileName,
            file_size: val?.fileSizeInMegabytes.toString(),
          }));
          cb(urls);
        } else {
          Toast?.show(responseData?.message, ToastError());
        }
      } catch (error) {
        console.error('API Error:', error);
        dispatch(LoaderAction.LoaderFalse());
        Toast.show(error?.message, ToastError());
      }
    };
  };
}

export default ChatMiddleware;
