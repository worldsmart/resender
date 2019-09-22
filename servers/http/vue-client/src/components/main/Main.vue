<template src="./template.html"></template>

<script scoped >
  export default {
    name:'app-main',
    data:function () {
      return{
        counter:1,
        msgData:[],
        countMsg:1,
        multiSelect:[],
        loading:false
      }
    },
    created:function () {
      this.getMsgs()
    },
    computed:{
      maxPage:function () {
        let tmp = this.countMsg - (this.countMsg % 20);
        tmp = tmp / 20;
        if(this.countMsg % 20) tmp++;
        return tmp;
      }
    },
    methods:{
      markAll:function () {
        for (let i = 0;i < document.getElementById('msgBox').children.length; i++){
          document.getElementById('msgBox').children[i].children[0].click();
        }
      },
      addSelect:function (value) {
        let tmp = this.multiSelect.filter(v=>{
          return v == value ? true : false
        });
        if(tmp[0]){
          this.multiSelect = this.multiSelect.filter(v=>{
            return v == value ? false : true
          });
        }else {
          this.multiSelect.push(value);
        }
      },
      reload:function () {
        this.counter = 1;
        this.multiSelect = [];
        this.uncheckAll();
        this.getMsgs();
        document.getElementById('msgBox').scrollTop = 0;
      },
      clickLeft:function () {
        if(this.counter <= 1) return;
        else {
          this.counter--;
          this.multiSelect = [];
          this.uncheckAll();
          this.getMsgs(this.counter - 1);
          document.getElementById('msgBox').scrollTop = 0;
        }
      },
      clickRight:function () {
        if(this.counter >= this.maxPage) return;
        else {
          this.counter++;
          this.multiSelect = [];
          this.uncheckAll();
          this.getMsgs(this.counter - 1);
          document.getElementById('msgBox').scrollTop = 0;
        }
      },
      getMsgs(index = 0){
        this.loading = true;
        const headers = {
          'Content-Type':'application/json',
          authorization:localStorage.getItem('jwt'),
          'X-for':this.$route.params.id,
          'X-index':index.toString()
        };
        this.$http.get('/api/massages',{headers}).then(res=>{
          this.loading = false;
          if(res.body){
            this.countMsg = res.body.lengthMsg;
            this.msgData = res.body.data;
          }
        });
      },
      uncheckAll:function () {
        for (let i = 0;i < document.getElementById('msgBox').children.length; i++){
          document.getElementById('msgBox').children[i].children[0].checked = false;
        }
      }
    }
  }

</script>

<style scoped src="./style.css"></style>
