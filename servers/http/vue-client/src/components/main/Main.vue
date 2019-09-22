<template src="./template.html"></template>

<script scoped >
  export default {
    name:'app-main',
    props:['mailFor'],
    data:function () {
      return{
        counter:1
      }
    },
    created:function () {
      const headers = {
        'Content-Type':'application/json',
        authorization:localStorage.getItem('jwt'),
        'X-for':this.mailFor,
        'X-index':'1'
      };
      this.$http.get('/api/massages',{headers}).then(res=>{
        console.log(res.body)
      });
    }
  }

</script>

<style scoped src="./style.css"></style>
