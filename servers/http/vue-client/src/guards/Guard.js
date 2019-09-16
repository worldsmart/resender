export default (to, from, next)=>{
  if(to.fullPath == '/login') next(true);
  else if(localStorage.getItem('jwt')){
    next(true);
  }else {
    next('/login');
  }
}
