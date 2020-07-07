import { all, takeEvery, put, call } from 'redux-saga/effects';

import {
  GET_PAGES,
  GET_PAGES_SUCCESS,
  GET_PAGES_FAILURE,
  GET_PAGE,
  GET_PAGE_SUCCESS,
  GET_PAGE_FAILURE,
} from './actions';
import { PageResource } from 'services';

function* getPages() {
  try {
    const res = yield call(PageResource.GET_MANY);
    yield put({
      type: GET_PAGES_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: GET_PAGES_FAILURE,
      payload: error,
    });
  }
}

function* getPage({ id }) {
  try {
    const res = yield call(PageResource.GET_ONE, id);
    yield put({
      type: GET_PAGE_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: GET_PAGE_FAILURE,
      payload: error,
    });
  }
}

export default function* () {
  yield all([takeEvery(GET_PAGES, getPages), takeEvery(GET_PAGE, getPage)]);
}
