import React from 'react';
import ApiCaller from '../../Config/ApiCaller';
import Toast from 'react-native-toast-message';
import {ToastError, ToastSuccess, openStripeModal} from '../../Config/Helper';
import {AuthAction, GeneralAction, LoaderAction} from '../Actions';
import {NavigationService} from '../../Config';
import {Store} from '..';
import {BASE_URL} from '../../../env';
import axios from 'axios';

export class AuthMiddleware extends React.Component {
  static Login(payload, firebaseToken, t) {
    return async dispatch => {
      const data = {
        endPoint: '/auth/login',
        method: 'post',
        body: payload,
        headers: {firebaseToken},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        const data = response.data;
        const {foundUser, accessToken} = data;
        if (foundUser?.status == 3) {
          Toast.show({
            type: 'error',
            text1: 'Your account is Blocked',
            text2: 'Contact help center for further information.',
          });
          return;
        }
        Toast.show(ToastSuccess(t('LOGIN_SUCCESS')));
        dispatch(AuthAction.Signin({...foundUser, token: accessToken}));
        NavigationService.resetStack('UserStack');
      } else {
        Toast.show(ToastError(t('INVALID_CREDENTIALS')));
      }
    };
  }

  static DeleteAccount(t, cb) {
    const user = Store.getState()?.AuthReducer?.user;
    return async dispatch => {
      const data = {
        endPoint: '/users',
        method: 'delete',
        body: {},
        headers: {Authorization: `${user.token}`},
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        cb();
        const data = response.data;
        console.log('===delete data===>', JSON.stringify(data, null, 1));
        Toast.show(ToastSuccess(t('User account deleted')));
        dispatch(AuthAction.ClearRedux());
        NavigationService.resetStack('AuthStack');
      }
    };
  }

  static Signup(payload, t) {
    return async dispatch => {
      const data = {
        endPoint: '/auth/signup',
        method: 'post',
        body: payload,
        headers: {},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        const {User, authorization} = response?.data;
        Toast.show(ToastSuccess(t('SIGNUP_SUCCESS')));
        dispatch(AuthAction.UpdateTempUser({...User, token: authorization}));
        NavigationService.resetStack('Login');
      }
    };
  }

  static ResendOTP = ({cb}) => {
    const {token} = Store?.getState()?.AuthReducer?.tempUser;

    return async dispatch => {
      const data = {
        endPoint: '/auth/otp/resend',
        method: 'put',
        body: {},
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        cb();
      }
    };
  };

  static ForgotPassword(payload) {
    return async dispatch => {
      const data = {
        endPoint: '/auth/password/forgot',
        method: 'post',
        body: payload,
        headers: {},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        const {accessToken} = response.data;
        dispatch(AuthAction.UpdateTempUser({token: accessToken}));
        NavigationService.navigate('Verification', {from: 'forgotpassword'});
      }
    };
  }

  static ChangePassword({payload, cb}) {
    const user = Store?.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: '/auth/password',
        method: 'put',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response?.data?.success) {
        NavigationService.navigate('PasswordUpdated', {
          screen: 'changePassword',
        });
      }
      if (response?.data?.status == 406) {
        Toast.show(ToastError(response?.data?.message));
      }
    };
  }

  static GetUserProfile = ({cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/users/profile`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        cb(response?.data?.User);
      }
    };
  };

  static UpdateProfile({payload, callback, t}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: '/auth/profile',
        method: 'put',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        Toast.show(ToastSuccess(t('PROFILE_UPDATED')));
        callback();
        dispatch(AuthAction.Signin({...user, ...payload}));
      }
    };
  }

  static VerifyOtpForgotPassword({payload, cb, t}) {
    return async dispatch => {
      const {token} = Store.getState()?.AuthReducer?.tempUser;
      console.log('===TEMP USER token===>', JSON.stringify(token, null, 1));

      const data = {
        endPoint: '/auth/otp/verify/forgot-password',
        method: 'post',
        body: payload,
        headers: {Authorization: token},
        customUrl: '', //If define then call this else call baseUrl + endPoint
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        Toast.show(ToastSuccess(t('EMAIL_VARIFIED')));
        cb();
      }
    };
  }
  static SetNewPassword(payload, t) {
    return async dispatch => {
      const {token} = Store.getState()?.AuthReducer?.tempUser;

      const data = {
        endPoint: '/auth/password/reset',
        method: 'post',
        body: payload,
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        Toast.show(ToastSuccess(t('PASSWORD_UPDATED')));
        NavigationService.resetStack('Login');
      }
    };
  }

  static UploadImage = ({
    payload,
    type,
    uploadType,
    cb,
    customheaders = {},
  }) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const endPoint = `/uploads?type=${type}&uploadType=${uploadType}`;

      const headers = {
        Authorization: token,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data;',
        ...customheaders,
      };

      dispatch(LoaderAction.LoaderTrue());

      fetch(BASE_URL + endPoint, {
        method: 'POST',
        headers,
        body: payload,
      })
        .then(response => {
          dispatch(LoaderAction.LoaderFalse());
          return response.json();
        })
        .then(data => {
          if (data?.result[0]?.Location) {
            cb(data?.result);
          } else {
            Toast?.show(data?.message, ToastError());
          }
        })
        .catch(err => {
          dispatch(LoaderAction.LoaderFalse());
          Toast.show(ToastError(err));
        });
    };
  };

  static UploadImageSignUp = ({payload, cb, customheaders = {}}) => {
    return async dispatch => {
      const endPoint = `/uploads/misc?type=1&uploadType=1`;

      const headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data;',
        ...customheaders,
      };

      dispatch(LoaderAction.LoaderTrue());

      fetch(BASE_URL + endPoint, {
        method: 'POST',
        headers,
        body: payload,
      })
        .then(response => {
          dispatch(LoaderAction.LoaderFalse());
          return response.json();
        })
        .then(data => {
          if (data?.result[0]?.Location) {
            cb(data?.result);
          } else {
            Toast?.show(data?.message, ToastError());
          }
        })
        .catch(err => {
          dispatch(LoaderAction.LoaderFalse());
          Toast.show(ToastError(err));
        });
    };
  };
  static GetBundlePlans = cb => {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/bundle/plan`,
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

  static GetBundlePaymentLink = ({id, cb}) => {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/bundle/plan/link/${id}`,
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

  static GetBundlePaymentLinkArtist = ({cb}) => {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/bundle/plan/artist`,
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

  static GetSubscriptionsBundle = ({cb}) => {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/bundle/plan`,
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

  static sendGiftRequest({id, amount, cb}) {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const data = {
        endPoint: `/liveStream/gift/${id}`,
        method: 'post',
        body: {amount},
        headers: {Authorization: token},
        customUrl: '', //If define then call this else call baseUrl + endPoint
        dispatch,
      };

      console.log('===data===>', JSON.stringify(data, null, 1));

      const response = await ApiCaller.Request(data);

      if (response) {
        cb(response?.data);
      }
    };
  }

  static GetNotifications = ({offset = 0, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/users/notification/?limit=10&offset=${offset}`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        cb(response?.data?.notify);
      }
    };
  };

  static MarkAllNotificationRead = () => {
    return async dispatch => {
      console.log('MARKING NOTIFICATIONS AS READ');
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/notification/mark-all-read`,
        method: 'put',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        console.log('MARKING NOTIFICATIONS AS READ');
        dispatch({type: 'REFETCH_NOTIFICATIONS', payload: null});
      }
    };
  };

  static GetAddedCategory = ({cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/users/recommend_added/`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        cb(response?.data?.category);
      }
    };
  };
  static PostLike({id, type}) {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const data = {
        endPoint: `/liveStream/like/${id}`,
        method: 'post',
        body: {type},
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      console.log('===data===>', JSON.stringify(data, null, 1));

      const response = await ApiCaller.Request(data);
      if (response?.data?.success) {
      }
    };
  }

  static AcceptRejectRequest = ({id, payload, cb}) => {
    const {token} = Store?.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/competition/${id}`,
        method: 'put',
        body: payload,
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        cb(response?.data?.success);
      }
    };
  };

  static GetMySubscriptionPlans = ({cb}) => {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: '/bundle/plan/active',
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

  static GetAdminKPIs = ({cb}) => {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: '/auth/admin',
        method: 'post',
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

  static CreateCommunityPost = ({body, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const data = {
        endPoint: `/community`,
        method: 'post',
        body: body,
        headers: {Authorization: token},
        customUrl: '', //If define then call this else call baseUrl + endPoint
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        cb(response?.data);
      }
    };
  };

  static LikeCommunityPost = ({body, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const data = {
        endPoint: `/community/like/${body.id}`,
        method: 'post',
        body: body,
        headers: {Authorization: token},
        customUrl: '', //If define then call this else call baseUrl + endPoint
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        cb(response?.data);
      }
    };
  };

  static CommentCommunityPost = ({body, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const data = {
        endPoint: `/community/comment/${body.id}`,
        method: 'post',
        body: {text: body.text},
        headers: {Authorization: token},
        customUrl: '', //If define then call this else call baseUrl + endPoint
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        cb(response?.data);
      }
    };
  };

  static CommunityCommentReply = ({body, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      console.log('===REPLY API BODY===', {
        commentId: body.commentId,
        text: body.text,
      });
      const data = {
        endPoint: `/community/reply/${body.commentId}`,
        method: 'put',
        body: {text: body.text},
        headers: {Authorization: token},
        customUrl: '', //If define then call this else call baseUrl + endPoint
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      console.log('===REPLY API RESPONSE===', response);

      if (response) {
        cb(response?.data);
      }
    };
  };

  static EditCommentCommunityPost = ({body, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const data = {
        endPoint: `/community/comment/${body.commentId}`,
        method: 'put',
        body: {text: body.text},
        headers: {Authorization: token},
        customUrl: '', //If define then call this else call baseUrl + endPoint
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        cb(response?.data);
      }
    };
  };

  static DeleteCommentCommunityPost = ({body, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      // const data = {
      //   endPoint: `/community/comment/${body.commentId}`,
      //   method: 'delete',
      //   body,
      //   headers: {Authorization: token},
      //   customUrl: '', //If define then call this else call baseUrl + endPoint
      //   dispatch,
      // };
      // const response = await ApiCaller.Request(data);
      // if (response) {
      //   cb(response?.data);
      // }
      try {
        dispatch(LoaderAction.LoaderTrue());
        const response = await axios.delete(
          `${BASE_URL}/community/comment/${body.commentId}`,
          {
            headers: {
              Authorization: token,
            },
            data: {text: 'this comment has been deleted'},
          },
        );
        cb();
      } catch (error) {
        console.log('ERRPR DELETEING COMMENT', error);
      } finally {
        dispatch(LoaderAction.LoaderFalse());
      }
    };
  };

  static GetCommunityPosts = ({body, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      let endPoint = '/community';
      if (body?.title) {
        endPoint += `?title=${body.title}`;
      }
      const data = {
        endPoint,
        method: 'get',
        body,
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        cb(response?.data);
      }
    };
  };

  static GetCommunityPostById = ({id, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const data = {
        endPoint: `/community/${id}`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        cb(response?.data);
      }
    };
  };

  static PurchaseComPostBoost = ({id, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const data = {
        endPoint: `/bundle/plan/post/${id}`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        cb(response?.data);
      }
    };
  };

  static IapPurchase = ({body, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const data = {
        endPoint: '/iap',
        method: 'post',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
        body,
      };
      console.log('=======UPDATEING SERVER API CALL, AUTH MIDDLEWARE=======');
      console.log('===body===>', body);
      const response = await ApiCaller.Request(data);
      console.log(
        '===[IapPurchase] response===>',
        JSON.stringify(response.data, null, 1),
      );
      if (response) {
        await cb(response?.data);
      }
    };
  };

  static GetUserBalance = ({cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const data = {
        endPoint: '/users/balance',
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };
      const response = await ApiCaller.Request(data);
      if (response) {
        await cb(response?.data);
      }
    };
  };

  // ARTIST POSTS MIDDLEWARES

  static GetArtistPostById = ({id, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const data = {
        endPoint: `/users/post_by/${id}`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        cb(response?.data?.post);
      }
    };
  };

  static LikeArtistPost = ({body, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const data = {
        // endPoint: `/users/post/like/${body.id}`,
        endPoint: `/community/like/artist_post/${body.id}`,
        method: 'post',
        body: body,
        headers: {Authorization: token},
        customUrl: '', //If define then call this else call baseUrl + endPoint
        dispatch,
      };
      const response = await ApiCaller.Request(data);
      console.log(
        '===========LikeArtistPost===========>',
        JSON.stringify(response, null, 1),
      );
      if (response) {
        cb(response?.data?.success);
      }
    };
  };

  static CommentArtistPost = ({body, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const data = {
        // endPoint: `/users/post/comment/${body.id}`,
        endPoint: `/community/artist_comment/${body.id}`,
        method: 'post',
        body: {text: body.text},
        headers: {Authorization: token},
        customUrl: '', //If define then call this else call baseUrl + endPoint
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        cb(response?.data);
      }
    };
  };

  static CommunityArtistReply = ({body, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      console.log('===ARTIST REPLY API BODY===', {
        commentId: body.commentId,
        text: body.text,
      });
      const data = {
        endPoint: `/community/reply/${body.commentId}`,
        method: 'post',
        body: {text: body.text},
        headers: {Authorization: token},
        customUrl: '', //If define then call this else call baseUrl + endPoint
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      console.log('===ARTIST REPLY API RESPONSE===', response);

      if (response) {
        cb(response?.data);
      }
    };
  };

  static EditCommentArtistPost = ({body, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const data = {
        endPoint: `/users/post/comment/${body.commentId}`,
        method: 'put',
        body: {text: body.text},
        headers: {Authorization: token},
        customUrl: '', //If define then call this else call baseUrl + endPoint
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        cb(response?.data);
      }
    };
  };

  static DeleteCommentArtistPost = ({body, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      try {
        dispatch(LoaderAction.LoaderTrue());
        const response = await axios.delete(
          `${BASE_URL}/users/post/comment/${body.commentId}`,
          {
            headers: {
              Authorization: token,
            },
            data: {text: 'this comment has been deleted'},
          },
        );
        cb();
      } catch (error) {
        console.log('ERROR DELETING ARTIST POST COMMENT', error);
      } finally {
        dispatch(LoaderAction.LoaderFalse());
      }
    };
  };
}

export default AuthMiddleware;
