import axios from 'axios';
import config from '../../config/config';

export const fetchUsers = (redirect) => {
return (dispatch) => {
    dispatch({type: 'FETCHING_USERS'});
    return axios
      .get(`${config.apiUrl}profiles/`)
      .then(response => {
        dispatch(fetchUserSuccess(response.data));
      })
      .catch(error => {
        console.log(error); //TODO handle error
        redirect.push('./ErrorPage');
      });
  };
};

export const fetchUserSuccess = (users) => {
  return {
    type: 'FETCHED_USERS',
    users,
  };
};


export const getUserHash = (redirect) => {

    return dispatch => {
      return axios
        .get(`${config.apiUrl}profiles/me`, {
              headers: { Authorization: 'Token ' + localStorage.getItem('token') }
        })
        .then(response => {
          const{icon_hash} = response.data;
            dispatch(getUserHashSuccess(icon_hash));
        })
        .catch(error => {
            localStorage.removeItem('token');
            redirect.go(0);
            console.log(error);
        });
    };
};

export const getUserHashSuccess = (iconHash) =>{
  return {
    type: 'GET_LOGGED_USER_HASH',
    iconHash,
  };
};


//createUser
export const createAdminUser = (recordedBlob, hash) => {
  return function(dispatch) {
    dispatch(loadingProccess()); // can be used to render a spinner
    return axios
      .post(`${config.apiUrl}profiles/`, {
        name_audio: recordedBlob,
        icon_hash: hash,
        is_social: true
      })
      .then(response => {
        const {token} = response.data;

        localStorage.setItem('token', token);
        dispatch(identiconLoginSuccess(hash));
      })
      .catch( exception => {
        console.log(exception);
        if(exception.response != undefined && exception.response.data != undefined 
          && exception.response.data.error == 'user_exists') {
            dispatch(identiconLogin(hash, () => {}));
        } else {
          dispatch(userFailed());
        }
      });
  };
};

export const patchUser = (id, recordedBlob, hash, callback) => {
  return function(dispatch) {
    return axios
      .patch(`${config.apiUrl}profiles/${id}/`, {
        icon_hash: hash,
        name_audio: recordedBlob,
        headers: { Authorization: 'Token ' + localStorage.getItem('token') }
      }).then( response => {
        dispatch ({
          type: 'PATCHED_USER',
          audio_name: response.data.name_audio,
          icon_hash: response.data.icon_hash,
        });
        if(callback != undefined) {
          callback();
        }
      });
  };
};

export const deleteUser = (id, redirect, callback) => {
  return function(dispatch) {
    return axios
      .delete(`${config.apiUrl}profiles/${id}/`, { 
          headers: { Authorization: 'Token ' + localStorage.getItem('token') },
      }).then( response => {
        dispatch(userDeleted());
        dispatch (fetchUsers(redirect));
        
        if(callback != undefined) {
          callback(true);
        }
      })
      .catch( exception => {
        console.log(exception);
        if(callback != undefined) {
          callback(false, exception);
        }
      });;
  };
};

export const loadingProccess = () => {
  return {
    type: 'LOADING_USER',
  };
};

export const userFailed = () => {
  return {
    type: 'USER_FAILED',
  };
};

export const identiconLogin = (iconHash, callback) => {
  return dispatch => {
      return axios.post(`${config.apiUrl}login/`, {icon_hash: iconHash})
        .then(response=>{
          localStorage.setItem('token',response.data.token);
          callback(true);
          dispatch(identiconLoginSuccess(iconHash));
        }).catch(err=>{
          console.log(err);
          callback(false);
        });
    };
};

export const identiconLoginSuccess = (iconHash) => {
  return {
    type: 'LOGIN_SUCCESS',
    iconHash: iconHash,
  };
};

export const removeUser = () => {
  return {
    type: 'REMOVE_USER',
  };
};

export const userDeleted = () => {
  return {
    type: 'DELETED_USER',
  };
};
