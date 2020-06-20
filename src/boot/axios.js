import Vue from 'vue';
import axios from 'axios';

export const cancelToken = axios.CancelToken;

const request = axios.create({ baseURL: 'api' });

Vue.prototype.$request = request;
