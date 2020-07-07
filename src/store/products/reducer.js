import {
  GET_PRODUCTS,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
} from './actions';

const initState = {
  loading: false,
  products: [],
  product: {},
};

export default function (state = initState, action) {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        loading: true,
      };
    case GET_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        products: [],
      };
    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.products,
      };
    default:
      return state;
  }
}
