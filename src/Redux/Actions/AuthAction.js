import React, {Component} from 'react';
import {
  SIGNOUT,
  SIGNIN,
  UPDATE_TEMP_USER,
  UPDATE_IS_VIEWED_WELCOME,
  UPDATE_LANGUAGE
} from '../Constants';

export class AuthAction extends Component {
  static Signin(data) {
    return {type: SIGNIN, payload: data};
  }
  static UpdateTempUser(data) {
    return {type: UPDATE_TEMP_USER, payload: data};
  }
  static Updatelanguage(data) {
    return {type: UPDATE_LANGUAGE, payload: data};
  }
  static UpdateIsViewedWelcome(data) {
    return {type: UPDATE_IS_VIEWED_WELCOME, payload: data};
  }
  static Signout() {
    return {type: SIGNOUT};
  }
  static ClearRedux() {
    return {type: SIGNOUT};
  }

}

export default AuthAction;
