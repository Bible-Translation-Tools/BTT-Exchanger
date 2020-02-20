/* global describe it test expect jest*/
import React from 'react';
import {Authentication} from '../../../../js/pages/Login/Authentication';
import {shallow} from 'enzyme';

const mockProps = {
  loading: false,
  txt: {
    languages: 'english',
  },
  users: [{is_social: false, id: 1}, {is_social: true, id: 2}],
  identiconLogin: jest.fn(),
  history: []
};
describe('Authentication test suite', () => {
  const wrapper = shallow(<Authentication {...mockProps} />);
  it('renders the Authentication correctly', () => {
    expect(wrapper.find('AuthPage').length).toBe(1);
    expect(wrapper.find('h2').length).toBe(1);
    expect(wrapper.find('Retry').length).toBe(1);
    expect(wrapper.find('SettingsButton').length).toBe(1);
  });

  it('should navigate to settings', () => {
    wrapper.instance().onSettingsClick();
    expect(wrapper.instance().props.history.length).toEqual(1);
  });
});
