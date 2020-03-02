/* global describe  it:true expect:true  jest:true */
import React from 'react';
import {shallow} from 'enzyme';
import  MessageDialog from '../../../js/components/MessageDialog';

const mockProps = {
  txt: {
    ok: "ok"
  }
};
describe('Message Dialog Suite', () => {

  const wrapper = shallow(<MessageDialog {...mockProps} />);

  it('should render Message Dialog successfully', ()=> {
    expect(wrapper.find('Container').length).toEqual(1);
    expect(wrapper.find('Overlay').length).toEqual(1);
    expect(wrapper.find('Window').length).toEqual(1);
    expect(wrapper.find('Message').length).toEqual(1);
    expect(wrapper.find('OkButton').length).toEqual(1);
  });

});
