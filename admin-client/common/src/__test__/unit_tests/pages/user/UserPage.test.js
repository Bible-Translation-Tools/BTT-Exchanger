/* global describe it test expect jest */
import React from 'react';
import {UserPage} from '../../../../js/pages/user/UserPage';
import {shallow} from 'enzyme';

const mockProps = {
  loading: false,
  txt: {
    
  },
  users: [{is_social: false, id: 1}, {is_social: true, id: 2}],
  fetchUsers: jest.fn(),
};
describe('User Page test suite', () => {
  const wrapper = shallow(<UserPage {...mockProps} />);
  it('renders the UserPage correctly', () => {
    expect(wrapper.find('Container').length).toBe(1);
    expect(wrapper.find('Grid').length).toBe(1);
    expect(wrapper.find('UserCard').length).toBe(1);
  });
});
