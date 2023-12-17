import { createRouter, createWebHistory } from 'vue-router';
import Cookies from 'js-cookie';
import { routers } from './router';
import util from '../libs/util';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routers
});

router.beforeEach((to, from, next) => {
  util.title(String(to.meta.title));
  const name = String(to.name);
  // 白名单
  const whiteList = [
    'login',
    'login-qr',
    'register',
    'register-result',
    'relate',
    'reset',
    'authorize',
    'test'
  ];
  const isInWhiteList = util.oneOf(name, whiteList);
  if (!Cookies.get('userInfo') && !isInWhiteList) {
    // 判断是否已经登录且页面不在白名单
    next({
      name: 'login'
    });
  } else if (Cookies.get('userInfo') && name == 'login') {
    // 判断是否已经登录且前往的是登录页
    util.title();
    next({
      name: 'home_index'
    });
  } else {
    util.toDefaultPage([...routers], name, router, next);
  }
});

router.afterEach(() => {
  // util.openNewPage(router.app, to.name, to.params, to.query);
  window.scrollTo(0, 0);
});

export default router;
