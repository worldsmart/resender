import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/Login'
import Guard from './../guards/Guard'

Vue.use(Router)

let router =  new Router({
  mode: 'history',
  routes: [
    {
      path:'/login',
      name:'login',
      component:Login
    },
    {
      path:'*',
      name:'404'
    }
  ]
});

router.beforeEach(Guard);

export default router
