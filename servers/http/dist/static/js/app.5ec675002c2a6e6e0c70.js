webpackJsonp([0],{0:function(t,a){},"69o7":function(t,a){},"6j1F":function(t,a){},GBH4:function(t,a){},JHp6:function(t,a){},NHnr:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s=e("7+uW"),i={},n={name:"navbar",methods:{logout:function(){i.user={},localStorage.removeItem("jwt"),window.location.reload()},updateUser:function(){i.user?(this.loggedIn=!0,this.user=i.user):setTimeout(this.updateUser,200)}},data:function(){return{loggedIn:!!i.user,user:void 0}},created:function(){this.updateUser()}},o={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",[e("nav",{on:{click:function(a){t.loggedIn=!0}}},[e("div",{staticClass:"nav-wrapper navbar"},[e("a",{staticClass:"brand-logo",attrs:{href:"/"}},[t._v("MAILER")]),t._v(" "),e("div",{staticClass:"navItem"},[t.loggedIn?e("ul",{staticClass:"right hide-on-med-and-down",attrs:{id:"nav-mobile"}},[e("li",[e("router-link",{staticClass:"navLink",attrs:{to:"/"}},[t._v("All mails")])],1),t._v(" "),e("li",[e("router-link",{staticClass:"navLink",attrs:{to:"/new"}},[t._v("New")])],1),t._v(" "),e("li",[e("router-link",{staticClass:"navLink",attrs:{to:"/spam"}},[t._v("Spam")])],1),t._v(" "),e("li",{on:{click:function(a){return t.logout()}}},[e("router-link",{staticClass:"navLink",attrs:{to:"#"}},[t._v("Logout")])],1),t._v(" "),e("li",[e("div",{staticStyle:{margin:"0 0 0 20px"},attrs:{id:"email"}},[t._v(t._s(t.user.email+"@onyame.ml"))])])]):t._e()])])])])},staticRenderFns:[]};var r={name:"app-footer",data:function(){return{count:(new Date).getFullYear()}}},l={render:function(){var t=this.$createElement,a=this._self._c||t;return a("footer",[a("div",{staticClass:"copiright"},[this._v("Personal mail client ")]),this._v(" "),a("div",{staticClass:"copiright"},[this._v(" Copyright "+this._s(this.count)+" ©")])])},staticRenderFns:[]};var c={name:"App",components:{Navbar:e("VU/8")(n,o,!1,function(t){e("JHp6")},"data-v-3f6f245a",null).exports,AppFooter:e("VU/8")(r,l,!1,function(t){e("69o7")},"data-v-3531a421",null).exports}},d={render:function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticStyle:{"min-height":"100vh",display:"flex","flex-direction":"column"},attrs:{id:"app"}},[a("navbar"),this._v(" "),a("router-view"),this._v(" "),a("app-footer")],1)},staticRenderFns:[]},u=e("VU/8")(c,d,!1,null,null,null).exports,v=e("/ocq"),m={name:"login",data:function(){return{errors:{email:!1,password:!1,text:""},data:{email:"",password:""},loading:!1}},methods:{mailValidate:function(t){this.errors.email=!1,t.value?/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{2,}$/.test(t.value)?(t.classList.remove("invalid"),t.className+=" valid"):(t.classList.remove("valid"),t.className+=" invalid",this.errors.email=!0):(t.classList.remove("valid"),t.classList.remove("invalid"))},passwordValidate:function(t){this.errors.password=!1,t.value?/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(t.value)?(t.classList.remove("invalid"),t.className+=" valid"):(t.classList.remove("valid"),t.className+=" invalid",this.errors.password=!0):(t.classList.remove("valid"),t.classList.remove("invalid"))},onSubmit:function(){var t=this;if(!this.errors.email&&!this.errors.password&&this.data.email&&this.data.password){this.loading=!0;this.$http.post("/api/server_login",{email:this.data.email,password:this.data.password},{headers:{"Content-Type":"application/json;charset=utf-8"}}).then(function(a){t.loading=!1,a.body.jwt?(localStorage.setItem("jwt",a.body.jwt),localStorage.setItem("email",a.body.email),i.user=a.body,t.$router.push("/"),M.toast({html:"You are successfully logged in!"})):t.errors.text="*"+a.body.err})}}}},p={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"login"},[e("form",{staticClass:"login_form card-panel teal lighten-2"},[e("div",{staticClass:"title"},[t._v("Login:")]),t._v(" "),e("div",{staticClass:"input-field col s6",staticStyle:{margin:"10px"}},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.data.email,expression:"data.email"}],staticStyle:{color:"rgb(71,69,84)"},attrs:{id:"login",type:"text"},domProps:{value:t.data.email},on:{input:[function(a){a.target.composing||t.$set(t.data,"email",a.target.value)},function(a){return t.mailValidate(a.target)}]}}),t._v(" "),e("label",{staticStyle:{color:"rgb(71,69,84)"},attrs:{for:"login"}},[t._v("Login")])]),t._v(" "),e("div",{staticClass:"input-field col s6",staticStyle:{margin:"10px"}},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.data.password,expression:"data.password"}],staticStyle:{color:"rgb(71,69,84)"},attrs:{onblur:"",id:"password",type:"password"},domProps:{value:t.data.password},on:{input:[function(a){a.target.composing||t.$set(t.data,"password",a.target.value)},function(a){return t.passwordValidate(a.target)}]}}),t._v(" "),e("label",{staticStyle:{color:"rgb(71,69,84)"},attrs:{for:"password"}},[t._v("Password")])]),t._v(" "),t.errors.text?e("div",{staticClass:"danger"},[t._v(t._s(t.errors.text))]):t._e(),t._v(" "),e("div",{staticClass:"btn waves-effect waves-light submit",on:{click:function(a){return t.onSubmit()}}},[t._v("Submit\n      "),e("i",{staticClass:"material-icons right"},[t._v("send")])]),t._v(" "),t.loading?e("div",{staticClass:"progress"},[e("div",{staticClass:"indeterminate"})]):t._e()])])},staticRenderFns:[]};var g=e("VU/8")(m,p,!1,function(t){e("6j1F")},"data-v-e80346e8",null).exports,f={props:["onlyFor"],data:function(){return{msg:[]}},created:function(){var t=this,a={"Content-Type":"application/json;charset=utf-8",Authorization:localStorage.getItem("jwt")};this.$http.get("/api/get_mails",{headers:a}).then(function(a){a.body.admin&&a.body.data&&a.body.data.forEach(function(a){t.msg.unshift(a)})})}};var h={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"row main"},[e("div",{staticClass:"col s3 sidebar"},[t._v("\n    text\n  ")]),t._v(" "),e("div",{staticClass:"col s9"},[e("div",{staticClass:"mails"},t._l(t.msg,function(a){return e("div",{staticClass:"col box"},[e("router-link",{staticClass:"mail",attrs:{to:a.link}},[a.mailbox?e("div",[t._v("\n              "+t._s(a.mailbox)+"\n            ")]):t._e(),t._v(" "),a.subject?e("div",[t._v("\n              "+t._s(a.subject)+"\n            ")]):t._e()])],1)}),0)])])},staticRenderFns:[]};var _=e("VU/8")(f,h,!1,function(t){e("GBH4")},"data-v-4c2b5ae8",null).exports,w={props:["onlyFor"],data:function(){return{msg:[]}},created:function(){var t=this,a={"Content-Type":"application/json;charset=utf-8",Authorization:localStorage.getItem("jwt"),"x-onlyfor":this.$route.params.id};this.$http.get("/api/get_posts",{headers:a}).then(function(a){a.body&&(console.log(a.body),a.body.forEach(function(a){t.msg.unshift(a)}))})}};var b={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"row main"},[e("div",{staticClass:"col s3 sidebar"},[t._v("\n    text\n  ")]),t._v(" "),e("div",{staticClass:"col s9"},[e("div",{staticClass:"mails",staticStyle:{"max-width":"100%"}},t._l(t.msg,function(a){return e("div",{staticClass:"col box"},[e("router-link",{staticClass:"mail",attrs:{to:"/"+a.id}},[a.from?e("div",{staticClass:"from"},[t._v("\n              "+t._s(a.from)+"\n            ")]):t._e(),t._v(" "),a.subject?e("div",{staticClass:"subject"},[t._v("\n              "+t._s(a.subject)+"\n            ")]):t._e(),t._v(" "),a.read?t._e():e("div",{staticClass:"newMsg"},[t._v("\n              *New\n            ")])])],1)}),0)])])},staticRenderFns:[]};var C=e("VU/8")(w,b,!1,function(t){e("Ono5")},"data-v-78bdd1cd",null).exports;var y=e("8+8L");s.a.use(v.a),s.a.use(y.a);var x=new v.a({mode:"history",routes:[{path:"/login",name:"login",component:g},{path:"/",name:"app-main",component:_},{path:"/:id",name:"msg",component:g},{path:"/mailboxes/:id",name:"mailbox",component:C,beforeEnter:function(t,a,e){var s,i,n;s="/api/get_admin",i=function(t){t.success?e(!0):e(!1)},(n=new XMLHttpRequest).onreadystatechange=function(){4==n.readyState&&200==n.status&&i(JSON.parse(n.responseText))},n.open("GET",s,!0),n.setRequestHeader("Content-Type","application/json"),n.setRequestHeader("Authorization",localStorage.getItem("jwt")),n.send(null)}},{path:"*",name:"404",redirect:"/"}]});x.beforeEach(function(t,a,e){var s,n,o;"/login"!=t.fullPath||i.user||localStorage.getItem("jwt")?i.user&&!localStorage.getItem("jwt")?(i.user={},e("/login")):localStorage.getItem("jwt")&&i.user?"/login"==t.fullPath?e(a.fullPath):e(!0):localStorage.getItem("jwt")?(s="/api/authorization",n=function(s){s.success?(localStorage.setItem("email",s.user.email),i.user=s.user,"/login"==t.fullPath?"/login"==a.fullPath?e("/"):e(a.fullPath):e(!0)):(localStorage.removeItem("jwt"),e("/login"))},(o=new XMLHttpRequest).onreadystatechange=function(){4==o.readyState&&200==o.status&&n(JSON.parse(o.responseText))},o.open("GET",s,!0),o.setRequestHeader("Content-Type","application/json"),o.setRequestHeader("Authorization",localStorage.getItem("jwt")),o.send(null)):e("/login"):e(!0)});var S=x;s.a.config.productionTip=!1,new s.a({el:"#app",router:S,components:{App:u},template:"<App/>"})},Ono5:function(t,a){}},["NHnr"]);
//# sourceMappingURL=app.5ec675002c2a6e6e0c70.js.map