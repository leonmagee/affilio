import { PROMO_FILTER } from './actions';

export const promoFilterReducer = (state = null, action) => {
  switch (action.type) {
    case PROMO_FILTER:
      return action.payload;
    default:
      return state;
  }
};
