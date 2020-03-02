/* global describe it test expect jest */
import React from 'react';
import {SettingsPage} from '../../../../js/pages/settings/SettingsPage';
import {shallow} from 'enzyme';

const mockProps = {
  loading: false,
  txt: {
    
  },
};
describe('Settings page test suite', () => {
  const wrapper = shallow(<SettingsPage {...mockProps} />);
  it('renders the Setting page correctly', () => {
    expect(wrapper.find('Container').length).toBe(1);
    expect(wrapper.find('BackLink').length).toBe(1);
    expect(wrapper.find('Header').length).toBe(1);
    expect(wrapper.first('SettingsContainer').length).toBe(1);
    expect(wrapper.first('SettingsItem').length).toBeGreaterThan(0);
    expect(wrapper.first('SettingsTitle').length).toBeGreaterThan(0);
    expect(wrapper.first('SettingsValue').length).toBeGreaterThan(0);
    expect(wrapper.first('SettingsInput').length).toBeGreaterThan(0);
    expect(wrapper.first('ButtonsContainer').length).toBe(1);
    expect(wrapper.first('SaveButton').length).toBe(1);
    expect(wrapper.first('RestoreDefaultsButton').length).toBe(1);
  });

  
});
