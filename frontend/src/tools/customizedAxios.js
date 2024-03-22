import axios from 'axios';

const customizedAxios = axios.create({
  baseURL: 'http://localhost:8000/api/task/',
  withCredentials: true,
  headers: {
    'UserLang': window.navigator.language,
    'Content-Type': 'application/json;charset=utf-8',
  }
});

export default customizedAxios

// 以下の形でimportすること
// import {default as axios} from '@/tools/customizedAxios.js'
