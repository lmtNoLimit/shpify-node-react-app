import { all, takeEvery, put, call } from 'redux-saga/effects';

import {
  GET_PRODUCTS,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
} from './actions';
import { ProductResource } from 'services';

function* getProducts() {
  try {
    const res = yield call(ProductResource.GET_MANY);
    yield put({
      type: GET_PRODUCTS_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: GET_PRODUCTS_FAILURE,
      payload: error,
    });
  }
}

export default function* () {
  yield all([takeEvery(GET_PRODUCTS, getProducts)]);
}
