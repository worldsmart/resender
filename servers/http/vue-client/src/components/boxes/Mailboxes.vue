<template src="./template.html"></template>

<script scoped >
  export default {
    name:'app-mailboxes',
    data:function () {
      return {
        mailboxes:[],
        filter:''
      }
    },
    created:function () {
      const headers = {
        'Content-Type':'application/json',
        authorization:localStorage.getItem('jwt')
      };
      this.$http.get('/api/mailboxes',{headers}).then(res=>{
        this.mailboxes = res.body;
        for(let i = 0;i < this.mailboxes.length;i++){
          this.mailboxes[i] = this.mailboxes[i].substring(0,this.mailboxes[i].indexOf('.'));
        }
      });
    },
    computed:{
      filtered:function () {
        return this.mailboxes.filter(mailbox=>{
          if(this.filter){
            if((mailbox + '@onyame.ml').match(this.filter)) return true;
            else return false;
          }else return true;
        });
      }
    }
  }
</script>

<style scoped src="./style.css"></style>
