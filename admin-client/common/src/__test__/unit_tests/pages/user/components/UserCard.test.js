/* global describe  it:true expect:true  test:true */
import React from 'react';
import {shallow} from 'enzyme';
import  UserCard from '../../../../../js/pages/user/components/UserCard';
import sinon from 'sinon';


const willMount = sinon.spy();
const didMount = sinon.spy();
const willUnmount = sinon.spy();

const mockProps = {
  id: 0,
  user: {
    icon_hash: 'FFFFFF',
  },
  onDeleteUser: jest.fn()
};

describe.skip('User card suite', function() {
  test('renderer', function() {
    const {wrapper} = shallow(<UserCard {...mockProps} />);
    expect(wrapper.find('UserCardContainer')).toBe(true);
    expect(wrapper.find('Card')).toBe(true);
    expect(wrapper.find('ImageContainer')).toBe(true);
    expect(wrapper.find('Image')).toBe(true);
    expect(wrapper.find('CardOptions')).toBe(true);
    expect(wrapper.find('Buttons')).toBe(true);
    expect(wrapper.find('PlayButton')).toBe(true);
    expect(wrapper.find('DeleteButton')).toBe(true);
    expect(wrapper.find('ReactPlayer')).toBe(true);
    expect(wrapper.find('ImageContainer')).toBe(true);
    expect(wrapper.find('ImageContainer')).toBe(true);
  });
});
