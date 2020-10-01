import axios from 'axios';
import config from '../../config/config';
import { UPDATE_LANGUAGE, IMPORT_LOCALIZATION } from '../reduxConstants';


export const fetchLocalization = (lang) => {
  return function(dispatch) {
    dispatch(dispatchLocalizationFetching());
    return axios
      .get(`${config.apiUrl}localization/?lang=${lang}`)
      .then(response => {
        dispatch(dispatchLocalizationReceived(response.data));
        const storedLanguage = localStorage.getItem('language');
        if (storedLanguage) {
          dispatch(updateLanguage(storedLanguage))
        }
      })
      .catch(err => {
        dispatch(dispatchLocalizationFailed(err));
      });
  };
};

export const importLocalization = (file, callback) => {
  var data = new FormData();
  data.append('file', file);
  return function(dispatch) {
    return axios
      .post(`${config.apiUrl}localization/file`, data, {
        timeout: 120000,
      })
      .then(response => {
        var localization = response.data.localization;
        dispatch({
          type: IMPORT_LOCALIZATION,
          localization
        });
        if(callback != undefined) {
          callback(true);
        }
      })
      .catch( exception => {
        if(callback != undefined) {
          callback(false);
        }
      });
  };
};

export const updateLanguage = (updatelanguage) => {

  return {
    type: UPDATE_LANGUAGE,
    updatelanguage,
  };
};

export const dispatchLocalizationReceived = (response) => {
  return {
    type: 'LOCALIZATION_SUCCESS',
    response,
  };
};
export const dispatchLocalizationFailed = err => {
  return {
    type: 'LOCALIZATION_FAILED',
    err: err.toString(),
  };
};
export const dispatchLocalizationFetching = () => {
  return {
    type: 'LOCALIZATION_FETCHING',
  };
};
