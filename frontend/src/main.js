import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// axios
import axios from 'axios';
window.axios = axios;
axios.defaults.withCredentials = true;
window.axios.defaults.headers.common['UserLang'] = window.navigator.language;
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

axios.defaults.baseURL = 'http://localhost:8000/api/task/';



const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
