<template src="./template.html"></template>

<script scoped >
  export default {
    name:'app-mail',
    data:function () {
      return{
        msg:{},
        chars:''
      }
    },
    created:function () {
      const headers = {
        'Content-Type':'application/json',
        authorization:localStorage.getItem('jwt'),
        'X-for':this.$route.params.msg,
        'X-id':this.$route.params.id
      };
      this.$http.get('/api/massage',{headers}).then(res=>{
        if(res.body.err) this.$router.push({ path: '/' });
        else {
          this.msg = res.body;
          if(this.msg.attachments[0]){
            this.msg.attachments.forEach(atachment=>{
              console.log(atachment)
              atachment.content.data = new Uint8Array(atachment.content.data);
              atachment.content['url'] = URL.createObjectURL(new Blob([atachment.content.data], {type : atachment.contentType}));
            });
          }
          this.$forceUpdate();
        }
      });
    }
  }

</script>

<style scoped src="./style.css"></style>
