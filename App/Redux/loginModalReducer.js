import { TOGGLE_LOG_IN } from './actions';

export const loginModalReducer = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_LOG_IN:
      return action.payload;
    default:
      return state;
  }
};
