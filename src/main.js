import Vue from 'vue'
import Router from 'vue-router'
import App from './components/App.vue'
import Index from './pages/Index.vue'
import '../resources/less/main.less'
import FastClick from 'fastclick'

FastClick.attach(document.body);

Vue.use(Router);

let router = new Router({
    routes:[
        {
            path:'/index',
            component:Index
        },
        {
            path:'*',
            redirect:'/index'
        }
    ]
})

const app = new Vue({
    el:'#app',
    router,
    render:h => h(App)
})