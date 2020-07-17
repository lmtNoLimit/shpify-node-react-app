import axios from 'axios';
// import { getAuthToken } from './cookiesService';

export const makeRequest = (req: any) => {
  return axios({
    ...req,
    auth: {
      username: process.env.REACT_APP_API_KEY,
      password: process.env.REACT_APP_API_PASSWORD,
    },
  });
};

const Resource = (resourceName: string) => {
  let url = `/shopify/api/${resourceName}`;
  return {
    GET_MANY: (params: string) =>
      makeRequest({
        method: 'GET',
        url: `${url}.json`,
        params,
      }),
    GET_ONE: (id: string) =>
      makeRequest({
        method: 'GET',
        url: `${url}/${id}.json`,
      }),
    CREATE: (data: object) =>
      makeRequest({
        method: 'POST',
        url: `${url}.json`,
        data,
      }),
    UPDATE: (id: string, data: object) =>
      makeRequest({
        method: 'PUT',
        url: `${url}/${id}.json`,
        data,
      }),
    DELETE: (id: string) =>
      makeRequest({
        method: 'DELETE',
        url: `${url}/${id}.json`,
      }),
  };
};

export default Resource;
