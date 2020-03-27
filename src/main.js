import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import Octicon from 'vue-octicon/components/Octicon.vue'
import Notifications from 'vue-notification'
import VueRouter from "vue-router";
import Vuex from 'vuex'
import VeeValidate from 'vee-validate';
import { store } from './store/index';
import * as axios from 'axios';
import 'vue-octicon/icons/gear'
import './style.scss'

Vue.config.productionTip = false;

const VueTruncate = require('vue-truncate-filter')
Vue.use(VueTruncate)

Vue.use(BootstrapVue)
Vue.use(Notifications)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VeeValidate, {
  classes: true,
  classNames: {
    // valid: 'is-valid',
    invalid: 'is-invalid'
  }
});
Vue.component('octicon', Octicon);

const server = require("../config").server;
axios.defaults.baseURL = server;
const accessToken = localStorage.getItem("accessToken");
axios.defaults.headers.common = { 'Authorization': `Bearer ${accessToken}` };

// http request 拦截器
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
        case 401:
        case 403: {
          Vue.notify({
            group: 'main',
            type: 'error',
            text: error.response.data.message
          });
          store.commit("setShowLoading", false);
          return new Promise(() => { });
        }
      }
    }
    return Promise.reject(error);
  }
);

Vue.prototype.$http = axios;

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
