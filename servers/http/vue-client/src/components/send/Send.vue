<template src="./template.html"></template>

<script scoped>
  export default {
    name:'send',
    data:function () {
      return{
        attachments:{}
      }
    },
    methods:{
      addAttachment:function (files) {
        if(files[0]){
          files = files[0];
          this.attachments[files.name] = files;
          document.getElementById('attachmentsBox').innerHTML += `<div id="${files.name}" style="display: flex;border-bottom: 1px solid;margin: 5px">${files.name}</div>`;
        }
      },
      send:function () {
        const formData = new FormData();
        formData.append('to',document.getElementById('to').value);
        formData.append('from',document.getElementById('from').value);
        formData.append('subject',document.getElementById('subject').value);
        formData.append('text',document.getElementById('text').value);
        for(let a in this.attachments){
          formData.append(this.attachments[a].name,this.attachments[a]);
        }
        const headers = {
          'Content-Type': 'multipart/form-data'
        };
        this.$http.post('/api/send', formData, {headers}).then(res=>{
          if(res.body.success){
            M.toast({html: 'Massage send'});
          }
          else {
            M.toast({html: 'Sending error'});
          }
        })
      }
    }
  }
</script>

<style scoped src="./style.css"></style>
