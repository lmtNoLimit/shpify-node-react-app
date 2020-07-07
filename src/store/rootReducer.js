import { combineReducers } from 'redux';

import pageReducer from './pages/reducer';
import productReducer from './products/reducer';

const rootReducer = combineReducers({
  pageReducer,
  productReducer,
});

export default rootReducer;
