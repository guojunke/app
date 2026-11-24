import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';


import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);

Vue.config.productionTip = false;
import './assets/javascript';
import './assets/css/index.scss';

import '@/components/index.js';

import Axios from './apis/axios';
window.$axios = Axios;

// import echarts from 'echarts';

// Vue.prototype.$echarts = echarts; 

import Mui from 'vue-awesome-mui';
Vue.use(Mui);
Vue.prototype.$mui = Mui; 

Vue.prototype.$imgUrl = 'http://47.92.72.52:9001/notice/downloadFile?fileName='; 
Axios.get({url: './../static/image/check.png'});

Vue.prototype.$userInfo = null; 

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

