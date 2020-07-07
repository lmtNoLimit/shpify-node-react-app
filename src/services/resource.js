import axios from 'axios';
// import { getAuthToken } from './cookiesService';

export const makeRequest = (req) => {
  return axios({
    ...req,
    auth: {
      username: process.env.REACT_APP_API_KEY,
      password: process.env.REACT_APP_API_PASSWORD,
    },
  });
};

const Resource = (resourceName) => {
  let url = `/shopify/api/${resourceName}`;
  return {
    GET_MANY: (params) =>
      makeRequest({
        method: 'GET',
        url: `${url}.json`,
        params,
      }),
    GET_ONE: (id) =>
      makeRequest({
        method: 'GET',
        url: `${url}/${id}.json`,
      }),
    CREATE: (data) =>
      makeRequest({
        method: 'POST',
        url: `${url}.json`,
        data,
      }),
    UPDATE: (id, data) =>
      makeRequest({
        method: 'PUT',
        url: `${url}/${id}.json`,
        data,
      }),
    DELETE: (id) =>
      makeRequest({
        method: 'DELETE',
        url: `${url}/${id}.json`,
      }),
  };
};

export default Resource;
