<template src="./template.html"></template>

<script scoped >
  export default {
   props:['onlyFor']
    ,
    data:function () {
      return{
        msg:[]
      }
    },
    created:getMsg
  }

  function getMsg() {
    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization':localStorage.getItem('jwt'),
      'x-onlyfor':this.$route.params.id
    };
    this.$http.get('/api/get_posts', {headers}).then((res)=>{
        if(res.body){
          console.log(res.body)
          res.body.forEach(msg=>{
            this.msg.unshift(msg);
          });
        }
    });
  }

</script>

<style scoped src="./style.css"></style>
