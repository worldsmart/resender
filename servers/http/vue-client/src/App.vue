<template>
  <div id="app" style="min-height: 100vh;display: flex;flex-direction: column">
    <navbar></navbar>
    <div style="min-height: 80%"><router-view></router-view></div>
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
