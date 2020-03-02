import axios from 'axios';
import config from '../../config/config';

export const fetchAllProjects = (query, redirect) => {
  return function(dispatch) {
    dispatch(dispatchAllProjectsLoading());
    return axios
      .get(`${config.apiUrl}projects/${query}`, {
        headers: { Authorization: 'Token ' + localStorage.getItem('token') },
      })
      .then(response => {
        dispatch(dispatchAllProjectsReceived(response.data, query ));
      })
      .catch(err => {
        localStorage.removeItem('token');
        redirect.push('/');
        dispatch(dispatchAllProjectsFailed(err));
      });
  };
};

export const deleteProject = (id, redirect, callback) => {
  return function(dispatch) {
    return axios
      .delete(`${config.apiUrl}projects/${id}/`, { 
          headers: { Authorization: 'Token ' + localStorage.getItem('token') },
      }).then( response => {
        dispatch(dispatchProjectDeleted());
        dispatch(fetchAllProjects('', redirect));
        
        if(callback != undefined) {
          callback(true);
        }
        
      })
      .catch( exception => {
        console.log(exception);
        if(callback != undefined) {
          callback(false, exception);
        }
      });
  };
};

export const dispatchAllProjectsReceived = (response, queryString) => {
  return {
    type: 'ALL_PROJECTS_SUCCESS',
    response,
    queryString,
  };
};

export const dispatchAllProjectsFailed = err => {
  return {
    type: 'ALL_PROJECTS_FAILED',
    err: err.toString(),
  };
};

export const dispatchAllProjectsLoading = () => {
  return {
    type: 'ALL_PROJECTS_LOADING',
  };
};

export const dispatchProjectDeleted = () => {
  return {
    type: 'PROJECT_DELETED',
  };
};