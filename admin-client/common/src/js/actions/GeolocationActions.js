import axios from 'axios';
import config from '../../config/config';
import * as types from '../reduxConstants';


export const fetchLocalization = (lang) => {
  return function(dispatch) {
    dispatch(dispatchLocalizationFetching());
    return axios
      .get(`${config.apiUrl}localization/?lang=${lang}`)
      .then(response => {
        dispatch(dispatchLocalizationReceived(response.data));
        const storedLanguage = localStorage.getItem('language') || 'en';
        dispatch(updateLanguage(storedLanguage));
      })
      .catch(err => {
        dispatch(dispatchLocalizationFailed(lang, err));
      });
  };
};

export const downloadLocalization = (lang, onSuccess) => {
  return function(dispatch) {
    dispatch(dispatchLocalizationFetching());
    return axios
      .get(`${config.apiUrl}localization/?lang=${lang}`)
      .then(response => {
        dispatch(dispatchLocalizationDownloaded(lang, response.data));
        if(onSuccess !== undefined) {
          onSuccess(lang, response.data);
        }
      })
      .catch(err => {
        dispatch(dispatchLocalizationFailed(lang, err));
      });
  };
};

export const importLocalization = (data, onSuccess, onError) => {
  return function(dispatch) {
    return axios
      .post(`${config.apiUrl}localization/file`, data, {
        timeout: 120000,
      })
      .then(response => {
        var localization = response.data.localization;
        dispatch({
          type: types.IMPORT_LOCALIZATION,
          localization
        });
        if(onSuccess !== undefined) {
          onSuccess();
        }
      })
      .catch( exception => {
        console.log(exception);
        if(onError !== undefined) {
          let error = exception.response.data.error || 'unknown';
          onError(error);
        }
      });
  };
};

export const updateLanguage = (updatelanguage) => {

  return {
    type: types.UPDATE_LANGUAGE,
    updatelanguage,
  };
};

export const dispatchLocalizationReceived = (response) => {
  return {
    type: types.LOCALIZATION_SUCCESS,
    response,
  };
};
export const dispatchLocalizationDownloaded = (lang, response) => {
  return {
    type: types.LOCALIZATION_DOWNLOADED,
    lang,
    response,
  };
};
export const dispatchLocalizationFailed = (lang, err) => {
  return {
    type: types.LOCALIZATION_FAILED,
    lang,
    err: err.toString(),
  };
};
export const dispatchLocalizationFetching = () => {
  return {
    type: types.LOCALIZATION_FETCHING,
  };
};
