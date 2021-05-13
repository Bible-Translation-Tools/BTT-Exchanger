import * as types from '../reduxConstants'

const INITIAL_STATE = { 
  txt: {
    get: function(key) {
      return this.language.hasOwnProperty(key) ? this.language[key] : key
    },
    language: {}
  },
  localization: {translation: {}, languages: {}}
};

export default (state = INITIAL_STATE, action = {}) => {

  switch (action.type) {
    case types.UPDATE_LANGUAGE:
      return {
        ...state,
        txt: {
          ...state.txt,
          language: state.localization.hasOwnProperty("translation") ? state.localization.translation : {}
        }
      };
    case types.LOCALIZATION_SUCCESS:
      return {
        ...state,
        localization: action.response.hasOwnProperty("languages") ? action.response : INITIAL_STATE.localization,
        loading: false,
      };
    case types.LOCALIZATION_FAILED:
      return {
        ...state, error: action.err, loading: false,
      };
    case types.LOCALIZATION_FETCHING:
      return {
        ...state, loading: true,
      };
    default:
      return state;
  }

};
