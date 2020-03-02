
import { combineReducers } from 'redux';
import GeolocationReducer from './GeolocationReducer';
import DirectionReducer from './DirectionReducer';
import Projects from './ProjectsPageReducer';
import user from './UserReducer.js';

export default combineReducers({
  geolocation: GeolocationReducer,
  direction: DirectionReducer,
  user,
  Projects
});
