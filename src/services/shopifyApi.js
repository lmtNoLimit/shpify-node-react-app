import axios from 'axios';

export const _createPage = (data) => {
  return axios({
    method: 'POST',
    url: '/shopify/api/pages.json',
    data: {
      page: data,
    },
  });
};

export const _updatePage = (id, data) => {
  return axios({
    method: 'PUT',
    url: `/shopify/api/pages/${id}.json`,
    data: {
      page: data,
    },
  });
};

export const _updateProduct = (id, data) => {
  return axios({
    method: 'PUT',
    url: `/shopify/api/products/${id}.json`,
    data: {
      product: data,
    },
  });
};
