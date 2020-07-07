import { all, fork } from 'redux-saga/effects';

import pageSagas from './pages/saga';
import productSagas from './products/saga';

export default function* rootSaga() {
  yield all([fork(pageSagas), fork(productSagas)]);
}
