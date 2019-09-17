<template src="./template.html"></template>

<script scoped >
  import DataService from './../../DataService'

  export default {
    name: 'navbar',
    methods: {
      logout: function () {
        DataService.user = {};
        localStorage.removeItem('jwt');
        window.location.reload();
      },
      updateUser:function () {
        if(DataService.user) {
          this.loggedIn = true;
          this.user = DataService.user;
        }
        else setTimeout(this.updateUser, 200);
      }
    },
    data:function () {
      return{
        loggedIn:!!DataService.user,
        user: undefined
      }
    },
    created:function () {
      this.updateUser();
    }
  }

</script>

<style scoped src="./style.css"></style>
