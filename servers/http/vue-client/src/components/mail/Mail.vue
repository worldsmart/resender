<template src="./template.html"></template>

<script>
  export default {
    name:'mail',
    data:function () {
      return{
        mail:{}
      }
    }
    ,
    created:function () {
      const headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization':localStorage.getItem('jwt'),
        'x-onlyfor':this.$route.params.id
      };
      this.$http.get('/api/mail', {headers}).then(res=>{
        this.mail = res.body;
        //this.$forceUpdate();
      });
    }
  }
</script>

<style scoped src="./style.css"></style>
