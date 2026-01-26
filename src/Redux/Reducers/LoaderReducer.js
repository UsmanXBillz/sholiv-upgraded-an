import {
  LOADER_TRUE,
  LOADER_FALSE,
  LOADING_PROGRESS,
  LOADING_PROGRESS_COMPLETE,
  SIGNOUT,
} from '../Constants';

const initialState = {
  loading: false,
  iapLoader: false,
  loadingProgress: false,
  progress: 0,
};

const actions = {
  LOADER_TRUE,
  LOADER_FALSE,
  LOADING_PROGRESS,
  LOADING_PROGRESS_COMPLETE,
  SIGNOUT,
};

export default function LoaderReducer(state = initialState, action) {
  const result = {
    [LOADER_TRUE]: {
      ...state,
      loading: true,
    },
    IAP_LOADER_TRUE: {
      ...state,
      iapLoader: true,
    },
    IAP_LOADER_FALSE: {
      ...state,
      iapLoader: false,
    },
    [LOADER_FALSE]: {
      ...state,
      loading: false,
    },
    [LOADING_PROGRESS]: {
      ...state,
      loadingProgress: true,
      progress: action.payload,
    },
    [LOADING_PROGRESS_COMPLETE]: {
      ...state,
      loadingProgress: false,
    },
    [SIGNOUT]: {
      ...state,
      loading: false,
      loadingProgress: false,
      progress: 0,
    },
  };

  if (actions[action.type]) {
    return (state = {
      ...result[action.type],
    });
  }

  return state;
}
