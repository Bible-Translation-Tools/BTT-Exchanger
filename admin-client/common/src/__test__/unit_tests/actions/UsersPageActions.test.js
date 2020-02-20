/* global describe it expect  beforeEach afterEach jest*/
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fetchUsers, getUserHash, patchUser, 
  createAdminUser, deleteUser, identiconLogin } from '../../../js/actions';
import * as types from '../../../js/reduxConstants';
import moxios from 'moxios';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Users Page Actions suite', () => {

  beforeEach(()=> {
    moxios.install();
  });

  afterEach(()=> {
    moxios.uninstall();
  });

  it('should fetch all users successfully', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        reponse: [{}],
      });
    });

    const expectedActions = [{type: types.FETCHING_USERS},
      {type: types.FETCHED_USERS, response: undefined}];
    const store = mockStore({users: []});
    return store.dispatch(fetchUsers()).then(()=> {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('should delete user successfully', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        reponse: {},
      });
    });

    const expectedActions = [{type: types.DELETED_USER}, {type: types.FETCHING_USERS}];
    const store = mockStore({users: []});
    return store.dispatch(deleteUser()).then(()=> {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  

});
