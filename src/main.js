import Vue from 'vue'
import Router from 'vue-router'
import App from './components/App.vue'
import Index from './pages/Index.vue'
import '../resources/less/main.less'

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

$(document).ready(()=>console.log('jQuery加载了'))

const app = new Vue({
    el:'#app',
    router,
    render:h => h(App)
})