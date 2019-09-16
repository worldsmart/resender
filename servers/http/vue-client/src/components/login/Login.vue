<template src="./template.html"></template>

<script>
  export default {
    name:'login',
    data(){
      return {
        errors:{
          email:false,
          password:false
        },
        data:{
          email:'',
          password:''
        }
        ,
        loading:false
      }
    },
    methods:{
      mailValidate:function(object){
        this.errors.email = false;
        if(!object.value){
          object.classList.remove('valid');
          object.classList.remove('invalid');
        }
        else if(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{2,}$/.test(object.value)){
          object.classList.remove('invalid');
          object.className += ' valid';
        }else {
          object.classList.remove('valid');
          object.className += ' invalid';
          this.errors.email = true;
        }
      },
      passwordValidate:function(object){
        this.errors.password = false;
        if(!object.value){
          object.classList.remove('valid');
          object.classList.remove('invalid');
        }
        else if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(object.value)){
          object.classList.remove('invalid');
          object.className += ' valid';
        }else {
          object.classList.remove('valid');
          object.className += ' invalid';
          this.errors.password = true;
        }
      },
      onSubmit:function () {
        if(!this.errors.email && !this.errors.password && this.data.email && this.data.password){
          this.loading = true;

        }
      }
    }
  }
</script>

<style scoped src="./style.css"></style>
