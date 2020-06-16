import Vue from 'vue';
import axios from 'axios';

const cancelSource = axios.CancelToken.source();

export const requestInterceptor = (config) => {
  config.cancelToken = cancelSource.token;
  return config;
};

const request = axios.create({ baseURL: 'api' });
request.interceptors.request.use(requestInterceptor);

Vue.prototype.$request = request;
