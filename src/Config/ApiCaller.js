import Axios from 'axios';
import Toast from 'react-native-toast-message';
import {NavigationService} from '.';
import {BASE_URL} from '../../env';
import {Store} from '../Redux';
import {AuthAction, LoaderAction} from '../Redux/Actions';
import {ToastError} from './Helper';

export var baseUrl = BASE_URL;

export const Img_url = '';

const CancelToken = Axios.CancelToken.source();
// create the source

Axios.interceptors.response.use(
  response => {
    return response;
  },
  async ({response, ...rest}) => {
    if (response?.status === 401) {
      try {
        Store.dispatch(AuthAction.ClearRedux());
        // CancelToken.cancel('Network error');
        console.log('Auth err', response);
        Toast.show(ToastError('Session Expired! Please login.'));
        NavigationService.resetStack('AuthStack');
        // });
      } catch (err) {
        console.log('Error= ===', err);
      }
    }
    if (
      response?.status === 403 &&
      response.data?.message !==
        "You don't have message package. Please Buy Messages"
    ) {
      try {
        Store.dispatch(AuthAction.ClearRedux());
        CancelToken.cancel('Network error');
        console.log('ERROR 403', response);
        Toast.show(ToastError('Session Expired! Please login.'));
        NavigationService.resetStack('AuthStack');
        // });
      } catch (err) {
        console.log('Error= ===', err);
      }
    }
    if (response?.status > 400) {
      console.log('===error===>', JSON.stringify(response, null, 1));
    }
    return response;
  },
);

export default class ApiCaller {
  //Handle Exception
  static handleError = (ep, dispatch, e) => {
    console.log(
      `EndPont ${ep} =========Error=========`,
      JSON.stringify(e, null, 1),
    );
    dispatch(LoaderAction.LoaderFalse());
    console.log('===[API_ERROR]===>', JSON.stringify(e, null, 1));
    if (e?.message) {
      Toast.show(ToastError(e?.message));
    }
  };

  //Handle Response
  static handleResponse = (ep, dispatch, res) => {
    // console.log(`EndPont ${ep} Response`, JSON.stringify(res?.data, null, 1));
    dispatch(LoaderAction.LoaderFalse());
    if (res?.status == 200 || res?.status == 201) {
      return res;
    } else {
      if (
        res?.data?.status == 403 &&
        res?.data?.message == 'Session expired! Please log-in again.'
      ) {
        Store.dispatch(AuthAction.ClearRedux());
        Toast.show(
          ToastError(
            res?.data?.error || res?.data?.Error || res?.data?.message,
          ),
        );
        NavigationService.resetStack('AuthStack');
      }
      if (res?.data?.error || res?.data?.Error || res?.data?.message) {
        Toast.show(
          ToastError(
            res?.data?.error || res?.data?.Error || res?.data?.message,
          ),
        );
      }
    }
  };

  //Api Call
  static Request = async ({
    endPoint = '',
    method = '',
    body = {},
    headers = {},
    customUrl = '',
    onUploadProgress = () => {},
    dispatch,
  }) => {
    this.source = CancelToken;

    const url = customUrl ? customUrl : `${baseUrl}${endPoint}`;
    const requestHeaders = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    if (method === 'post') {
      requestHeaders.headers['onUploadProgress'] = progress =>
        onUploadProgress(progress);
    }

    dispatch(LoaderAction.LoaderTrue());

    if (method === 'get') {
      return Axios[method](url, requestHeaders)
        .then(res => this.handleResponse(endPoint, dispatch, res))
        .catch(err => this.handleError(endPoint, dispatch, err?.response));
    }
    if (method == 'delete') {
      console.log('===method===>', JSON.stringify(method, null, 1));
      return Axios[method](url, requestHeaders)
        .then(res => this.handleResponse(endPoint, dispatch, res))
        .catch(err => this.handleError(endPoint, dispatch, err?.response));
    } else {
      return Axios[method](url, body, requestHeaders)
        .then(res => this.handleResponse(endPoint, dispatch, res))
        .catch(err => this.handleError(endPoint, dispatch, err?.response));
    }
  };

  static UploadFile = async (
    endPoint,
    payload,
    customheaders = {},
    dispatch,
  ) => {
    const headers = {
      Authorization:
        Store?.getState()?.AuthReducer?.tempUser?.token ??
        Store?.getState()?.AuthReducer?.user?.token,
      Provider:
        Store?.getState()?.AuthReducer?.tempUser?.provider ??
        Store?.getState()?.AuthReducer?.user?.provider,
      'Content-Type': 'multipart/form-data;',
      Accept: 'application/json',
      ...customheaders,
    };

    try {
      const response = await fetch(baseUrl + endPoint, {
        method: 'POST',
        headers,
        body: payload,
      });
      const data = await response.json();

      if (response.ok) {
        dispatch(LoaderAction.LoaderFalse());
        return data;
      } else {
        throw new Error(data.message || 'Error in API call');
      }
    } catch (error) {
      throw error;
    }
  };
}
