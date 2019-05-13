import { createStore } from 'redux';
import { reducer } from './reducers';

const initialState = {
  loggedIn: 0,
  userType: 0,
};

const store = createStore(reducer, initialState);

module.exports = store;
