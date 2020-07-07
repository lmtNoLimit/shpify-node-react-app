import {
  GET_PAGES,
  GET_PAGES_SUCCESS,
  GET_PAGES_FAILURE,
  GET_PAGE,
  GET_PAGE_SUCCESS,
  GET_PAGE_FAILURE,
  CLEAR_PAGE_DATA,
} from './actions';

const initState = {
  loading: false,
  pages: [],
  page: {},
};

export default function (state = initState, action) {
  switch (action.type) {
    case GET_PAGES:
      return {
        ...state,
        loading: true,
      };
    case GET_PAGES_FAILURE:
      return {
        ...state,
        loading: false,
        pages: [],
      };
    case GET_PAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        pages: action.payload.pages,
      };

    case GET_PAGE:
      return {
        ...state,
        loading: true,
      };
    case GET_PAGE_FAILURE:
      return {
        ...state,
        loading: false,
        page: {},
      };
    case GET_PAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        page: action.payload.page,
      };
    case CLEAR_PAGE_DATA: {
      return {
        ...state,
        page: {},
      };
    }
    default:
      return state;
  }
}
