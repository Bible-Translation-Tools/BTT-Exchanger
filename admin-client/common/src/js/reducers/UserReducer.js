import * as types from '../reduxConstants'

const INITIAL_STATE = {
  users: [],
  loading: false,
  audioName: '',
  hash: '',
  loggedInUser: null,
};

export default( state= INITIAL_STATE, action ={}) => {

  switch (action.type) {

    case types.FETCHING_USERS:
    case types.LOADING_USER:
      return {
        ...state,
        loading: true,
      };

    case types.FETCHED_USERS:
      return {
        ...state,
        users: action.users,
        loading: false,
      };

    case types.PATCHED_USER:
      return {
        ...state,
      };

    case types.DELETED_USER:
      return {
        ...state,
      };
    
    case types.LOGIN_SUCCESS:
    case types.GET_LOGGED_USER_HASH:
      return {
        ...state,
        loggedInUser: action.iconHash,
        loading: false,
      };
    
    case types.REMOVE_USER:
    case types.USER_FAILED:
      return INITIAL_STATE;

    default:
      return {
        ...state,
      };
  }

};
