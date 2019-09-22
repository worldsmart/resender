<template>
  <div id="app" style="height: 100vh;display: flex;flex-direction: column;overflow:hidden">
    <navbar></navbar>
    <router-view></router-view>
    <app-footer></app-footer>
  </div>
</template>

<script>
  import Navbar from './components/navbar/Navbar'
  import AppFooter from './components/footer/AppFooter'

  export default {
    name: 'App',
    components: {
      Navbar,
      AppFooter
    }
  }
</script>
