import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/Login'
import Main from '../components/main/Main'
import Posts from '../components/posts/Posts'
import Mail from '../components/mail/Mail'
import Guard from './../guards/Guard'
import AdminGuard from './../guards/AdminGuard'
import VueResorse from 'vue-resource'

Vue.use(Router)
Vue.use(VueResorse)

let router =  new Router({
  mode: 'history',
  routes: [
    {
      path:'/login',
      name:'login',
      component:Login
    },
    {
      path:'/',
      name:'app-main',
      component:Main
    },
    {
      path:'/:id',
      name:'msg',
      component:Mail
    },
    {
      path:'/mailboxes/:id',
      name:'mailbox',
      component:Posts,
      beforeEnter:AdminGuard
    },
    {
      path:'*',
      name:'404',
      redirect: '/'
    }
  ]
});

router.beforeEach(Guard);

export default router
