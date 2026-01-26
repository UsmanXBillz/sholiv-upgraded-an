import {
  SIGNIN,
  SIGNOUT,
  UPDATE_TEMP_USER,
  UPDATE_IS_VIEWED_WELCOME,
  UPDATE_LANGUAGE
} from '../Constants';

const initialState = {
  user: null,
  tempUser: null,
  isViewedWelcome: false,
  isArtist: true,
  language: 'en'
};

export default function AuthReducer(state = initialState, action) {
  switch (action.type) {
    case SIGNIN:
      state = {
        ...state,
        user: action.payload,
        tempUser: null,
      };
      break;

    case UPDATE_TEMP_USER:
      state = {
        ...state,
        tempUser: action.payload,
      };
    break;

    case UPDATE_LANGUAGE:
      state = {
        ...state,
        language: action.payload,
      };
    break;

    case UPDATE_IS_VIEWED_WELCOME:
      state = {
        ...state,
        isViewedWelcome: action.payload
      }

    break;
   
    case SIGNOUT:
      state = {
        ...state,
        user: null,
        tempUser: null,
      };
      break;
   
    default:
      break;
  }
  return state;
}