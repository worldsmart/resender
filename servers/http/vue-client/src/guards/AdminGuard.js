export default (to, from, next)=>{
    httpGetAsync('/api/get_admin', (data)=>{
      if(data.success){
        next(true);
      }else {
        next(false);
      }
    });
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
