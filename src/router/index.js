import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 配置路由
const router =  new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/dashboard',
            meta: {
                auth: false,
            }
        },
        {
            path: '/login',
            component: () => import('../components/page/Login'),
            meta: {
                auth: false,
            }
        },
        {
            path: '/',
            component: () => import('../components/common/Home'),
            meta: { title: '自述文件'},
            children: [
                {
                    path: '/dashboard',
                    component: () => import('../components/page/Dashboard'),
                    meta: { title: '系统首页'},
                },
                {
                    path: '/goods',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/GoodsTable.vue'),
                    meta: { title: '商品管理' }
                },
                {
                    path: '/category',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/CategoryTable.vue'),
                    meta: { title: '分类管理' }
                },
                {
                    path: '/orders',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/CategoryTable.vue'),
                    meta: { title: '订单管理' }
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                // {
                //     // 图片上传组件
                //     path: '/upload',
                //     component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                //     meta: { title: '文件上传' }
                // },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
            ]
        },
        {
            path: '*',
            redirect: '/404'
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
        let token = localStorage.getItem('admin_name');
        if (token) { // 获取当前的 token 是否存在
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
