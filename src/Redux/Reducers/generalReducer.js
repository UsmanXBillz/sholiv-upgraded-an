const initialState = {
  refetchListings: 0,
  refetchCommPost: 0,
  refetchNotification: 0,
};

export default function GeneralReducer(state = initialState, action) {
  switch (action.type) {
    case 'REFETCH_LISTINGS':
      state = {
        ...state,
        refetchListings: state.refetchListings + 1,
      };
      break;

    case 'REFETCH_COMM_POST':
      state = {
        ...state,
        refetchCommPost: state.refetchCommPost + 1,
      };
      break;

    case 'REFETCH_NOTIFICATIONS':
      state = {
        ...state,
        refetchNotification: state.refetchNotification + 1,
      };
      break;

    default:
      break;
  }
  return state;
}
