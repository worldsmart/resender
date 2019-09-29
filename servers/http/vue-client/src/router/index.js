import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/Login'
import Main from '../components/main/Main'
import Mailboxes from '../components/boxes/Mailboxes'
import Marked from '../components/marked/Marked'
import Mail from '../components/mail/Mail'
import Spam from '../components/spam/Spam'
import NewMsgs from '../components/newMsgs/NewMsgs'
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
      path:'/new',
      name:'app-new',
      component:NewMsgs
    },
    {
      path:'/marked',
      name:'app-marked',
      component:Marked
    },
    {
      path:'/spam',
      name:'app-spam',
      component:Spam
    },
    {
      path:'/mailbox',
      name:'app-mailboxes',
      component:Mailboxes,
      beforeEnter:AdminGuard
    },
    {
      path:'/mailbox/:id',
      name:'app-mailbox',
      component:Main,
      beforeEnter:AdminGuard
    },
    {
      path:'/mailbox/:id/new',
      name:'app-mailbox-new',
      component:NewMsgs,
      beforeEnter:AdminGuard
    },
    {
      path:'/mailbox/:id/marked',
      name:'app-mailbox-marked',
      component:Marked,
      beforeEnter:AdminGuard
    },
    {
      path:'/mailbox/:id/spam',
      name:'app-mailbox-spam',
      component:Spam,
      beforeEnter:AdminGuard
    },
    {
      path:'/:id',
      name:'msg',
      component:Mail
    },
    {
      path:'/mailbox/:msg/:id',
      name:'msg',
      component:Mail,
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
