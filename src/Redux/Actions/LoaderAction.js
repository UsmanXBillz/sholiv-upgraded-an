import {Component} from 'react';
import {
  LOADER_FALSE,
  LOADER_TRUE,
  LOADING_PROGRESS,
  LOADING_PROGRESS_COMPLETE,
} from '../Constants';

export class LoaderAction extends Component {
  static LoaderTrue() {
    return {type: LOADER_TRUE};
  }
  static LoaderFalse() {
    return {type: LOADER_FALSE};
  }
  static LoadingProgress(payload) {
    return {type: LOADING_PROGRESS, payload};
  }
  static LoadingProgressComplete(payload) {
    return {type: LOADING_PROGRESS_COMPLETE, payload};
  }
}

export default LoaderAction;
