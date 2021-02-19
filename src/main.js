// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from "axios";

import './assets/iconfont/iconfont.css'; // 引入阿里云自定义图标

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/icon.css';
// import 'babel-polyfill';


Vue.use(ElementUI);
Vue.use(axios);

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.baseUrl = 'http://localhost:8081';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
