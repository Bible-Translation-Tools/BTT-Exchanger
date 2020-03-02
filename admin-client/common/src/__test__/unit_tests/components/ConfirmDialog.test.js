/* global describe  it:true expect:true  jest:true */
import React from 'react';
import {shallow} from 'enzyme';
import  ConfirmDialog from '../../../js/components/ConfirmDialog';

const mockProps = {
  txt: {
    yes: "yes",
    no: "no"
  },
  onButtonClicked: jest.fn(),
  handleConfirm: jest.fn(),
  onConfirmed: jest.fn()
};
describe('Confirm Dialog Suite', () => {

  const wrapper = shallow(<ConfirmDialog {...mockProps} />);

  it('should render Confirm Dialog successfully', ()=> {
    expect(wrapper.find('Container').length).toEqual(1);
    expect(wrapper.find('Overlay').length).toEqual(1);
    expect(wrapper.find('Window').length).toEqual(1);
    expect(wrapper.find('Question').length).toEqual(1);
    expect(wrapper.find('Buttons').length).toEqual(1);
    expect(wrapper.find('YesButton').length).toEqual(1);
    expect(wrapper.find('NoButton').length).toEqual(1);
  });
});
