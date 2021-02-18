import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: () => import('../components/Login'),
            meta: {title: '登录界面'}
        },
        {
            path: '/dashboard',
            component: () => import('../components/Dashboard'),
            meta: {title: '系统首页'}
        },
        {
            path: '/404',
            component: () => import('../components/404'),
            meta: { title: '404' }
        }
    ]
})
