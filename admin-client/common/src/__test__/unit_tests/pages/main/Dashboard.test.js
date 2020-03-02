/* global describe it test expect jest */
import React from 'react';
import {Dashboard} from '../../../../js/pages/main/Dashboard';
import {shallow} from 'enzyme';

const mockProps = {
  loading: false,
  txt: {
    
  },
  languages: 'english',
  updateLanguage: jest.fn(),
};
describe('Dashboard test suite', () => {
  const wrapper = shallow(<Dashboard {...mockProps} />);
  it('renders the Dashboard correctly', () => {
    expect(wrapper.find('Container').length).toBe(1);
    expect(wrapper.find('Tabs').length).toBe(1);
    expect(wrapper.find('TabList').length).toBe(1);
    expect(wrapper.first('Tab').length).toBe(1);
    expect(wrapper.first('TabPanel').length).toBe(1);
  });

  test('on Select Language function', () => {
    wrapper.instance().onLanguageSelect('language');
    expect(mockProps.updateLanguage.mock.calls.length).toEqual(1);

  });
});
