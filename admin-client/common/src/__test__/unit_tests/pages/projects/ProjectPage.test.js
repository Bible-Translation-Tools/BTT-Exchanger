/* global it describe expect  jest*/
import React from 'react';
import {shallow} from 'enzyme';
import {ProjectContainer} from '../../../../js/pages/projects/ProjectPage';

const mockProps =  {
  loading: false,
  txt: {},
  projects: [
    {
      id: 1,
      book: {
        name: 'James',
      },
      language: {
        name: 'English',
      },
      version: {
        slug: 'ulb',
      },
      date_modified: '2018/05/17',
      mode: {
        name: 'chunk',
      },
      slug: 'mat',
    },

    {
      id: 2,
      book: {
        name: 'Jude',
      },
      language: {
        name: 'English',
      },
      version: {
        slug: 'ulb',
      },
      date_modified: '2018/05/17',
      mode: {
        name: 'verse',
      },
      slug: 'luk',
    },
  ],
  fetchAllProjects: jest.fn(),
};

describe('Project Page test suite', () => {

  const wrapper = shallow(<ProjectContainer {...mockProps} />);

  it('should render the component correctly', () => {
    expect(wrapper.find('Container').length).toBe(1);
    expect(wrapper.find('CardsContainer').length).toBe(1);
    expect(wrapper.first('ProjectCard').length).toBe(1);
  });

});
