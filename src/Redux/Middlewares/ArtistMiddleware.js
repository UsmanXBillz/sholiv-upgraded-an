import {t} from 'i18next';
import React from 'react';
import {Platform} from 'react-native';
import Toast from 'react-native-toast-message';
import {Store} from '..';
import {NavigationService} from '../../Config';
import ApiCaller from '../../Config/ApiCaller';
import {formateTimeString, ToastError, ToastSuccess} from '../../Config/Helper';
import {AuthAction, LoaderAction} from '../Actions';

export class ArtistMiddleware extends React.Component {
  static GetAllArtists = ({offset, cb, name = ''}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/users/list?name=${name}&offset=${offset}&limit=10`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log("responseeee====GetAllArtists=>>", response);
      if (response) {
        cb(response?.data?.Users?.rows);
      }
    };
  };
  static GetArtistType = cb => {
    return async dispatch => {
      const data = {
        endPoint: `/users/artist_type`,
        method: 'get',
        headers: {},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log("responseeee====GetAllArtists=>>", response);
      if (response) {
        cb(response?.data?.Users?.rows);
      }
    };
  };
  static GetBandType = cb => {
    return async dispatch => {
      const data = {
        endPoint: `/users/band`,
        method: 'get',
        headers: {},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log("responseeee====GetAllArtists=>>", response);
      if (response) {
        cb(response?.data?.Users?.rows);
      }
    };
  };

  static GetArtistProfileById = ({id, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/users/profile/${id}`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log("=======GetProfileById", response)

      if (response) {
        cb(response?.data?.User);
      }
    };
  };

  static GetPosts = ({payload, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/users/post`,
        method: 'get',
        body: payload,
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log('=======GetProfileById', response);

      if (response) {
        cb(response?.data?.post?.rows);
      }
    };
  };

  static GetArtistPosts = ({cb, id}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/users/post/${id}`,
        method: 'get',
        body: {},
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log('=======GetProfileById', response);

      if (response) {
        cb(response?.data?.post?.rows);
      }
    };
  };

  static FollowArtist(payload, cb) {
    // console.log('FollowArtist ka payload', payload);

    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: '/users/follow',
        method: 'post',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log(
      //   'FollowArtistFollowArtistFollowArtistFollowArtist',
      //   response?.data,
      // );

      if (response) {
        cb(response?.data);
      }
    };
  }

  static UploadPostArtist({payload, t}) {
    // console.log('UploadImageVideo', payload);

    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/users/post`,
        method: 'post',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log('UploadPostArtist Response', response);

      if (response) {
        Toast.show(ToastSuccess(t('POST_SUCCESS')));
        NavigationService.goBack();
      }
    };
  }

  static UpdateIntroVideo = ({payload, t}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const user = Store.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/users/profile`,
        method: 'put',
        headers: {Authorization: token},
        body: payload,
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log('responseeee====GetUserProfile=>>', response);
      if (response) {
        dispatch(AuthAction.Signin({...user, ...payload}));

        Toast.show(ToastSuccess(t('INTRO_VIDEO_SUCCESS')));

        NavigationService.goBack();
      }
    };
  };

  static EndCompetition = ({id, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/competition/end/${id}`,
        method: 'put',
        headers: {Authorization: token},
        body: {},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        cb();
      }
    };
  };
  static GetAllFollowing = ({id = '', offset, cb, name = ''}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/users/follow?id=${id}&offset=${offset}&limit=10&name=${name}`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        body: {},
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log('responseeee====GetAllFollowing=>>', response);
      if (response) {
        cb(response?.data?.Follow?.rows);
      }
    };
  };

  static GetAllFollowers = ({id = '', offset, cb, name = ''}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/users/follower?id=${id}&offset=${offset}&limit=10&name=${name}`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        body: {},
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log('responseeee====GetAllFollowing=>>', response);
      if (response) {
        cb(response?.data?.Follow?.rows);
      }
    };
  };

  // ye api aaigi abhi
  static GetSubscribers = ({payload, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/users/follower`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        body: payload,
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log('responseeee====GetAllFollowing=>>', response);
      if (response) {
        cb(response?.data?.Follow?.rows);
      }
    };
  };

  static CheckFollowing = ({id, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/users/follow/${id}`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response?.data?.success) {
        cb(true);
      }
    };
  };

  static GetActivePlan = ({cb, id}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/bundle/plan/active/${id}`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      cb(response?.data?.plan?.rows);
    };
  };

  static CreateLive({payload, cb}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: '/liveStream/',
        method: 'post',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        console.log('=====LIVE STEREA M CREATE=====', response);
        cb(response?.data?.stream);
      }
    };
  }

  static GetLiveStreams = ({cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/liveStream/`,
        method: 'get',
        body: {},
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        cb(response?.data?.stream?.rows);
      }
    };
  };
  static SessionComplete = ({id, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/liveStream/complete/${id}`,
        method: 'post',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log('responseeee====SessionComplete=>>', response);
      if (response) {
        cb(true);
      }
    };
  };

  static JoinStream = ({id, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/liveStream/join/${id}`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log('responseeee====JoinStream datappp sanap=>>', response?.data);
      if (response) {
        cb(response?.data);
      }
    };
  };

  static GetArtistsByType = ({offset = 0, artist_id = '', cb, name = ''}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      let endPoint = `/users/list?limit=10`;
      if (artist_id) {
        endPoint += `&artist_id=${artist_id}`;
      }
      if (name) {
        endPoint += `&name=${name}`;
      }
      if (offset) {
        endPoint += `&offset=${offset}`;
      }

      console.log(endPoint);

      const data = {
        // endPoint: `/users/list?artist_id=${artist_id}&name=${name}`,
        // endPoint: `/users/list?artist_id=${artist_id}&name=${name}&offset=${offset}&limit=10`,
        endPoint,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log('responseeee====GetArtistsByType=>>', response);
      if (response) {
        cb(response?.data?.Users?.rows);
      }
    };
  };

  static GetMyStream = cb => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/liveStream/my`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log('responseeee====GetMyStream=>>', response);
      if (response) {
        cb(response?.data?.stream?.rows);
      }
    };
  };

  static GetArtistStream = ({id, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/liveStream/artist/${id}`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      console.log('responseeee====GetMyStream=>>', response);
      if (response) {
        cb(response?.data?.stream?.rows);
      }
    };
  };

  static GetTopStreams = ({offset = 0, cb, name = ''}) => {
    const {token} = Store?.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/liveStream/top?name=${name}&offset=${offset}&limit=10`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log("responseeee====GetTopStreams=>>", response);
      if (response) {
        cb(response?.data?.stream?.rows);
      }
    };
  };

  static GetRecommendedArtists = ({offset = 0, cb, name = ''}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/users/recommend?name=${name}&limit=10&offset=${offset}`,
        method: 'get',
        body: {},
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      console.log('=======GetRecommendedArtists', response);

      if (response) {
        cb(response?.data?.foundUser?.rows);
      }
    };
  };

  static PostRecommendationCategory({payload, cb, t}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/users/recommend`,
        method: 'post',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      console.log('PostRecommendationCategory Response', response);

      if (response) {
        setTimeout(() => {
          Toast.show(ToastSuccess(t('CATEGORY_SUCCESS')));
        }, 600);
        cb();
      }
    };
  }

  static WithdrawAmountRequest(cb, t) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: '/users/with_draw',
        method: 'post',
        body: {},
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response?.data?.error) {
        return Toast.show(ToastError(response?.data?.error));
      } else {
        return Toast.show(ToastSuccess(t('REQUEST_SUCCESS')));
        // cb();
      }
    };
  }

  static CreatePaymentAccount(cb) {
    const {token} = Store?.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: '/users/create_payment_account',
        method: 'post',
        body: {},
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        cb(response?.data);
      }
    };
  }

  static GetBanks = ({cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/users/banks`,
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

  static GetEarnings = ({type = '', cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/users/earning?type=${type}`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log('responseeee====GetEarnings=>>', response?.data);
      if (response) {
        cb(response?.data);
      }
    };
  };

  static GetUserWithdraw({offset, status, limit = 10, cb}) {
    const user = Store.getState()?.AuthReducer?.user;

    let endPoint = `/users/with_draw/?limit=${limit}&offset=${offset}`;
    if (status) {
      endPoint += `&status=${status}`;
    }

    return async dispatch => {
      const data = {
        endPoint,
        method: 'get',
        body: {},
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };
      const response = await ApiCaller.Request(data);
      if (response) {
        cb(response?.data?.transaction?.rows);
      }
    };
  }

  static GetTransactions({
    offset,
    cb,
    payment_type,
    start_date,
    end_date,
    limit = 10,
  }) {
    const user = Store.getState()?.AuthReducer?.user;

    let endPoint = `/users/transaction/?limit=${
      limit === undefined ? 10 : limit
    }&offset=${offset}`;
    if (payment_type) {
      endPoint += `&payment_type=${payment_type}`;
    }
    if (start_date) {
      endPoint += `&start_date=${formateTimeString(start_date)}`;
    }
    if (end_date) {
      endPoint += `&end_date=${formateTimeString(end_date)}`;
    }

    console.log('===endPoint===>', JSON.stringify(endPoint, null, 1));

    return async dispatch => {
      const data = {
        endPoint,
        method: 'get',
        body: {},
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        cb(response?.data?.transaction?.rows);
      }
    };
  }

  static GetMyEarnings({
    offset,
    cb,
    earning_type,
    start_date,
    end_date,
    limit = 10,
  }) {
    const user = Store.getState()?.AuthReducer?.user;

    let endPoint = `/users/earning/?limit=${
      limit === undefined ? 10 : limit
    }0&offset=${offset}`;
    if (earning_type) {
      endPoint += `&earning_type=${earning_type}`;
    }
    if (start_date) {
      endPoint += `&start_date=${formateTimeString(start_date)}`;
    }
    if (end_date) {
      endPoint += `&end_date=${formateTimeString(end_date)}`;
    }

    console.log('===endPoint===>', JSON.stringify(endPoint, null, 1));

    return async dispatch => {
      const data = {
        endPoint,
        method: 'get',
        body: {},
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        cb(response?.data?.earning, response?.data?.total_earning);
      }
    };
  }

  static PlayIntro = ({id}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;
      const user = Store.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/users/play_intro/${id}`,
        method: 'put',
        headers: {Authorization: token},
        body: {},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      console.log('responseeee====PlayIntro=>>', response);
      if (response) {
        console.log('responseeee====PlayIntro=>>', response?.data?.user);
        dispatch(
          AuthAction.Signin({
            ...user,
            intro_view_count: response?.data?.User?.intro_view_count,
          }),
        );
      }
    };
  };

  static CreateCompetition({payload, cb}) {
    console.log('CreateCompetition ka ------>', payload);

    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: '/competition/',
        method: 'post',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      console.log('FCreateCompetitionCreateCompetition=>', response?.data);

      if (response) {
        cb(response?.data);
      }
    };
  }

  static DeletePost({id}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/users/post/${id}`,
        method: 'delete',
        body: {},
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        Toast.show(ToastSuccess(t('ITEM_DELETED')));
        NavigationService.goBack();
      }
    };
  }

  static DeleteLiveStream({id, cb}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/liveStream/${id}`,
        method: 'delete',
        body: {},
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        cb();
        Toast.show(ToastSuccess(t('ITEM_DELETED')));
        NavigationService.goBack();
      }
    };
  }

  static GetUpcomingCompetitions = ({offset, cb, name = '', limit = 10}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/competition/upcoming/?name${name}&offset=${offset}&limit=${limit}`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      console.log(
        '=======GetUpcomingCompetitions',
        response?.competition?.rows,
      );

      if (response) {
        cb(response?.data?.competition?.rows);
      }
    };
  };

  static GetMyCompetitions = ({offset, type, cb, name = '', limit = 10}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/competition/?type=${type}&name=${name}&offset=${offset}&limit=${limit}`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log(
      //   '=======G|||||||etMyCompetitions||||',
      //   response?.data?.competition?.rows,
      // );

      if (response) {
        cb(response?.data?.competition?.rows);
      }
    };
  };
  static StartCompetition({id, payload, cb}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/competition/available/${id}`,
        method: 'put',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        console.log('Line 764: Compition started', response?.data);
        cb();
      }
    };
  }

  static JoinCompetition({id, payload, cb}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/competition/${id}/join`,
        method: 'post',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        console.log('line number 788 joined  as competititor artist');
        cb(response?.data);
      }
    };
  }

  static CreateRound({id, payload, cb}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/competition/round/${id}`,
        method: 'post',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      if (response) {
        console.log('line 810  CreateRound', response?.data);
        cb();
      }
    };
  }

  static CompleteRound({id, payload, cb}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/competition/${id}/round/complete`,
        method: 'put',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        console.log('line number 835 CompleteRound', response?.data);
        cb();
      }
    };
  }
  static CompleteCompetition({id, payload, cb}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/competition/complete/${id}`,
        method: 'put',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        console.log(
          'line number 855 complete competition',
          response?.data?.competition,
        );
        cb(response?.data?.competition);
      }
    };
  }

  static CompetitorJoin({id, cb}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/competition/competitor/join/${id}`,
        method: 'put',
        body: {},
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        console.log('line number 876 CompetitorJoin', response?.data);
        cb();
      } else {
        cb('error');
      }
    };
  }

  static Vote({id, payload, t}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/competition/vote/${id}`,
        method: 'post',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        console.log('line number 898 Voted as fan');
        // Toast.show(ToastSuccess(t('VOTE__SUCCESS')));
      }
    };
  }

  static CompetitionReaction({id, payload, t}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/competition/${id}/like`,
        method: 'post',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        console.log('LINE NUMBER SOMETUNG WUITH REACTIONS');
      }
    };
  }

  static GetRecordedLive = ({id, cb}) => {
    return async dispatch => {
      const {token} = Store?.getState()?.AuthReducer?.user;

      const data = {
        endPoint: `/liveStream/${id}`,
        method: 'get',
        headers: {Authorization: token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      // console.log('responseeee====GetAllArtists=>>', response);
      if (response) {
        cb(response?.data?.zoom);
      } else {
        cb('error');
      }
    };
  };

  static GetZoomUrl = ({url, token, cb}) => {
    return async dispatch => {
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      };

      dispatch(LoaderAction.LoaderTrue());
      fetch(url, {
        method: 'GET',
        headers,
      })
        .then(response => {
          dispatch(LoaderAction.LoaderFalse());
          cb(response?.url); // Callback function for success
        })
        .catch(err => {
          dispatch(LoaderAction.LoaderFalse());
          Toast.show(ToastError(err)); // Show error toast
          cb(err); // Callback function for error
        });
    };
  };

  static BlockUser = (payload, cb) => {
    console.log('FollowArtist ka payload', payload);

    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/auth/block/${payload.id}`,
        method: 'post',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      console.log('BLOCK USRER ========', response?.data);

      if (response) {
        cb(response?.data);
      }
    };
  };

  static UnblockUser = (payload, cb) => {
    console.log('FollowArtist ka payload', payload);

    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: `/auth/unblock/${payload.id}`,
        method: 'post',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);
      console.log('UNBLOCK USER=====', response?.data);

      if (response) {
        cb(response?.data);
      }
    };
  };

  static AddBankDetails({payload, cb}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: '/users/bank-details',
        method: 'put',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        console.log('=====AddBankDetails=====', response);
        cb(response?.data?.stream);
      }
    };
  }

  static SendWithdrawRequest({payload, cb}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: '/users/with_draw',
        method: 'post',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        console.log('=====SendWithdrawRequest=====', response);
        cb(response?.data?.stream);
      }
    };
  }

  static FreeFollowArtist({payload, cb}) {
    const user = Store.getState()?.AuthReducer?.user;

    return async dispatch => {
      const data = {
        endPoint: '/follow/follow',
        method: 'post',
        body: payload,
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        console.log('=====FreeFollowArtist=====', response);
        cb(response?.data?.stream);
      }
    };
  }

  static GetArtistFollowings({payload, cb}) {
    const user = Store.getState()?.AuthReducer?.user;

    let endpoint = 'follow/followee?';

    if (payload?.name) {
      endpoint += `name=${payload.name}&`;
    }

    if (payload?.id) {
      endpoint += `id=${payload.idƒ}&`;
    }

    return async dispatch => {
      const data = {
        endPoint: endpoint,
        method: 'get',
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        console.log('=====GetArtistFollwees=====', response);
        cb(response?.data?.stream);
      }
    };
  }

  static GetArtistFollowers({payload, cb}) {
    const user = Store.getState()?.AuthReducer?.user;

    let endpoint = 'follow/follower?';

    if (payload?.name) {
      endpoint += `name=${payload.name}&`;
    }

    if (payload?.id) {
      endpoint += `id=${payload.idƒ}&`;
    }

    return async dispatch => {
      const data = {
        endPoint: endpoint,
        method: 'get',
        headers: {Authorization: user?.token},
        customUrl: '',
        dispatch,
      };

      const response = await ApiCaller.Request(data);

      if (response) {
        console.log('=====GetArtistFollwers=====', response);
        cb(response?.data?.stream);
      }
    };
  }
}

export default ArtistMiddleware;
