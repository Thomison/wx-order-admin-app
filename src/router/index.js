import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 配置路由
const router =  new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: () => import('../components/Login'),
            meta: {
                auth: false,
                title: '登录界面'
            }
        },
        {
            path: '/dashboard',
            component: () => import('../components/Dashboard'),
            meta: {
                auth: true,
                title: '系统首页'
            }
        },
        {
            path: '/404',
            component: () => import('../components/404'),
            meta: {
                auth: false,
                title: '404'
            }
        }
    ]
});

// 配置路由拦截器
/**
 * to表示即将进入的页面路由，
 * from表示当前导航正要离开的路由
 * next: Function:执行效果依赖 next 方法的调用参数。
 * next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed （确认的）。
 * next(false): 中断当前的导航。如果浏览器的 URL 改变了（可能是用户手动或者浏览器后退按钮），那么 URL 地址会重置到 from 路由对应的地址。
 * next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
 * next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回调。
 */

router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.auth) && to.meta.auth) { // 判断该路由是否需要登录权限
        let token = localStorage.getItem('name');
        if (name) { // 获取当前的 token 是否存在
            next()
        } else {
            // 不存在 token，需要重新认证
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath
                }
            })
        }
    }
    next();
});

export default router
