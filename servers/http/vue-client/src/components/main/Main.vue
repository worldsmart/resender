<template src="./template.html"></template>

<script scoped >
  export default {
    name:'app-main',
    data:function () {
      return{
        msg:[]
      }
    },
    created:function () {
      const headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization':localStorage.getItem('jwt')
      };
      this.$http.get('/api/get_mails', {headers}).then((res)=>{
        if(res.body['admin']){
          if(res.body['data']){
            res.body['data'].forEach(msg=>{
              this.msg.push(msg);
            });
          }
        }else {

        }
      });
    }
  }

</script>

<style scoped src="./style.css"></style>
