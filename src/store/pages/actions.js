export const GET_PAGES = 'GET_PAGES';
export const GET_PAGES_SUCCESS = 'GET_PAGES_SUCCESS';
export const GET_PAGES_FAILURE = 'GET_PAGES_FAILURE';

export const GET_PAGE = 'GET_PAGE';
export const GET_PAGE_SUCCESS = 'GET_PAGE_SUCCESS';
export const GET_PAGE_FAILURE = 'GET_PAGE_FAILURE';

export const SHOW_PAGE_SETTING = 'SHOW_PAGE_SETTING';
export const HIDE_PAGE_SETTING = 'HIDE_PAGE_SETTING';

export const CLEAR_PAGE_DATA = 'CLEAR_PAGE_DATA';

export const getPages = () => ({ type: GET_PAGES });

export const getPage = (id) => ({ type: GET_PAGE, id });

export const showPageSetting = () => ({ type: SHOW_PAGE_SETTING });
export const hidePageSetting = () => ({ type: HIDE_PAGE_SETTING });

export const clearPageData = () => ({ type: CLEAR_PAGE_DATA });
