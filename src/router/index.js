import Vue from 'vue';
import VueRouter from 'vue-router';
import Store from '@/store/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    
    redirect: '/login'
    // name: '',
    // component: () => import(/* webpackChunkName: "about" */ '../views/article/index.vue')
    // component:resove => require(['@/components/home'],resolve)
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    // component: () => import(/* webpackChunkName: "about" */ '../')
    component: resolve => require(['@/views/login/login.vue'],resolve)
  },
  {
    path: '/SceneVideo',
    name: 'SceneVideo',
    meta: {
      title: '现场影音'
    },
    // component: () => import(/* webpackChunkName: "about" */ '../views/SceneVideo/index.vue')
    component: resolve => require(['@/views/SceneVideo/index.vue'],resolve)
  },
  {
    path: '/TenderData',
    name: 'TenderData',
    meta: {
      title: '标段资料'
    },
    // component: () => import(/* webpackChunkName: "about" */ '../views/TenderData/index.vue')
    component: resolve => require(['@/views/TenderData/index.vue'],resolve)
  },
  {
    path: '/RateData',
    name: 'RateData',
    meta: {
      title: '日进度'
    },
    // component: () => import(/* webpackChunkName: "about" */ '../views/RateData/index.vue')
    component: resolve => require(['@/views/RateData/index.vue'],resolve)
  },
  {
    path: '/Check',
    name: 'Check',
    meta: {
      title: '报验预约'
    },
    // component: () => import(/* webpackChunkName: "about" */ '../views/Check/index.vue')
    component: resolve => require(['@/views/Check/index.vue'],resolve)
  },
  {
    path: '/NotifyManage',
    name: 'NotifyManage',
    meta: {
      title: '通知单管理'
    },
    // component: () => import(/* webpackChunkName: "about" */ '../views/NotifyManage/index.vue')
    component: resolve => require(['@/views/NotifyManage/index.vue'],resolve)
  },
  {
    path: '/Location',
    name: 'Location',
    meta: {
      title: '定位总览'
    },
    // component: () => import(/* webpackChunkName: "about" */ '../views/Location/index.vue')
    component: resolve => require(['@/views/Location/index.vue'],resolve)
  },
  {
    path: '/RateStatic',
    name: 'RateStatic',
    meta: {
      title: '工程进度统计'
    },
    // component: () => import(/* webpackChunkName: "about" */ '../views/RateStatic/index.vue')
    component: resolve => require(['@/views/RateStatic/index.vue'],resolve)
  },
  {
    path: '/TenderManage',
    name: 'TenderManage',
    meta: {
      title: '标段管理'
    },
    // component: () => import(/* webpackChunkName: "about" */ '../views/TenderManage/index.vue')
    component: resolve => require(['@/views/TenderManage/index.vue'],resolve)
  },
  {
    path: '/TenderDataManage',
    name: 'TenderDataManage',
    meta: {
      title: '标段资料管理'
    },
    // component: () => import(/* webpackChunkName: "about" */ '../views/TenderManage/index.vue')
    component: resolve => require(['@/views/TenderDataManage/index.vue'],resolve)
  },
  // 详情
  {
    path: '/TenderInfo',
    name: 'TenderInfo',
    meta: {
      title: '标段管理'
    },
    // component: () => import(/* webpackChunkName: "about" */ '../views/TenderInfo/index.vue')
    component: resolve => require(['@/views/TenderInfo/index.vue'],resolve)
  },
  // 详情
  {
    path: '/ProInfo',
    name: 'ProInfo',
    meta: {
      title: '标段管理'
    },
    // component: () => import(/* webpackChunkName: "about" */ '../views/ProInfo/index.vue')
    component: resolve => require(['@/views/ProInfo/index.vue'],resolve)
  },
  // 详情
  {
    path: '/AllInfo',
    name: 'AllInfo',
    meta: {
      title: '标段管理'
    },
    // component: () => import(/* webpackChunkName: "about" */ '../views/AllInfo/index.vue')
    component: resolve => require(['@/views/AllInfo/index.vue'],resolve)
  }
];

const router = new VueRouter({
  // mode: 'hash',
  // base: '',
  routes
});

router.beforeEach((to, from, next) => {
  try {
    if (to.meta.title) {
      window.document.title = to.meta.title;
      localStorage.setItem('linkName', to.path);
      Store.commit('setRouterName', to.path);
    }
    if (to.path === '/login') {
      Store.commit('clearUserInfo');
      next();
    } else if ((to.path !== '/login' && sessionStorage.getItem('userInfo')) || to.path === '/login') {
      next();
    } else if (to.path !== '/login') {
      next('login');
    } else {
      next();
    }
  } catch (error) {
    next();
  }
  
});


const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default router;
