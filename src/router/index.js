import { createRouter, createWebHistory } from "vue-router"
import { StartLoadingBar, FinishLoadingBar, ErrorLoadingBar } from "../utils/loadingbar.js";
import store from "../utils/store"
import { ref } from "vue";

const routes = [
    {
        path: '/',
        children: [
            {
                path: '/',
                name: 'MainPage',
                component: () => import('../views/Personal.vue')
            },
            {
                path: '/user',
                name: 'User',
                component: () => import('../views/Personal.vue')
            },
            {
                path: '/sign',
                name: 'Sign',
                component: () => import('../views/Sign.vue')
            },
            {
                path: '/login',
                name: 'Login',
                component: () => import('../views/login.vue')
            },
            {
                path: '/register',
                name: 'Register',
                component: () => import('../views/register.vue')
            },
            {
                path: "/proxies",
                name: 'Proxies',
                component: () => import('../views/proxies.vue')
            },
            {
                path: '/proxies/addproxies',
                name: "AddProxies",
                component: () => import('../views/addproxies.vue')
            },
            {
                path: '/realname',
                name: "RealName",
                component: () => import('../views/realname.vue')
            },
            {
                path: '/hello2023',
                name: 'newyear',
                component: () => import('../views/newyear.vue')
            },
            {
                path: '/prize',
                name: 'prize',
                component: () => import('../views/prize.vue')
            },
            {
                path: '/config',
                name: 'config',
                component: () => import('../views/config.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 检查本地存储是否存在token，若存在则直接使用
if (localStorage.getItem("token")) {
    store.commit("setToken", localStorage.getItem("token"));
}

router.beforeEach((to, from, next) => {
    StartLoadingBar();
    if (to.name === 'Login'){
        if (store.getters.GetToken){
            next({name: 'User' });
        }
        next();
    };
    if (to.name === 'Register'){
        if (store.getters.GetToken){
            next({name: 'User' });
        }
        next();
    };
    if (!store.getters.GetToken){
        console.log('未检测到登录TOKEN, 转向登录页！');
        next({name: 'Login' });
    } else {
        next();
    };
});

router.afterEach((to, from, next) => {
    FinishLoadingBar();
});

export default router