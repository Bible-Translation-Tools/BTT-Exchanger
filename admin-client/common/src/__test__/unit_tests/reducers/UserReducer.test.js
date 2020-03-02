/* global expect describe it */
import reducer from '../../../js/reducers/UserReducer';

describe('UserReducer', () => {

  it('should return the initial state', ()=> {
    expect(reducer(undefined, {})).toEqual({
      users: [],
      loading: false,
      audioName: '',
      hash: '',
      loggedInUser: null,
    });
  });

  it('should handle FETCHING_USERS', ()=> {
    expect(reducer([], {
      type: 'FETCHING_USERS',
    })).toEqual({
      loading: true,
    });
  });


  it('should handle FETCHED_USERS', ()=> {
    expect(reducer([], {
      type: 'FETCHED_USERS',
      users: ['user1', 'user2'],
    })).toEqual({
      loading: false,
      users: ['user1', 'user2'],
    });
  });


  it('should handle LOADING_USER', ()=> {
    expect(reducer([], {
      type: 'LOADING_USER',
    })).toEqual({
      loading: true,
    });
  });

  it('should handle PATCHED_USER', () => {
    expect(reducer([], {
      type: 'PATCHED_USER',
      name_audio: 'name audio',
      hash: 1234567890,
    })).toEqual({});
  });

  it('should handle DELETED_USER', () => {
    expect(reducer([], {
      type: 'DELETED_USER',
      name_audio: 'name audio',
      hash: 1234567890,
    })).toEqual({});
  });

  it('should handle LOGIN_SUCCESS', () => {
    expect(reducer([], {
      type: 'LOGIN_SUCCESS',
      iconHash: 1234567890,
    })).toEqual({
      loggedInUser: 1234567890,
      loading: false
    });
  });

  it('should handle GET_LOGGED_USER_HASH', () => {
    expect(reducer([], {
      type: 'GET_LOGGED_USER_HASH',
      iconHash: 1234567890,
    })).toEqual({
      loggedInUser: 1234567890,
      loading: false
    });
  });


  it('should handle REMOVE_USER', () => {
    expect(reducer([], {
      type: 'REMOVE_USER',
    })).toEqual({
      users: [],
      loading: false,
      audioName: '',
      hash: '',
      loggedInUser: null,
    });
  });

});
