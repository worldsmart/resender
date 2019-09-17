import DataService from './../DataService'

export default (to, from, next)=>{
  if(to.fullPath == '/login' && !DataService.user && !localStorage.getItem('jwt')) next(true);
  else if(DataService.user && !localStorage.getItem('jwt')){
    DataService.user = {};
    next('/login');
  }
  else if(localStorage.getItem('jwt') && DataService.user){
    if(to.fullPath == '/login'){
      next(from.fullPath);
    }else next(true);
  }
  else if(localStorage.getItem('jwt')){
    httpGetAsync('/api/authorization', (data)=>{
      if(data.success){
        localStorage.setItem('email', data.user.email);
        DataService.user = data.user;
        if(to.fullPath == '/login'){
          if(from.fullPath == '/login') next('/');
          else next(from.fullPath);
        }else next(true);
      }else {
        localStorage.removeItem('jwt');
        next('/login');
      }
    });
  }else {
    next('/login');
  }
}

function httpGetAsync(theUrl, callback)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(JSON.parse(xmlHttp.responseText));
  }
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.setRequestHeader('Content-Type', 'application/json');
  xmlHttp.setRequestHeader('Authorization', localStorage.getItem('jwt'));
  xmlHttp.send(null);
}
