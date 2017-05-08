var express = require('express');
var app = express();
function sss(){
//  主页输出 "Hello World"
app.get('/', function (req, res) {
   res.redirect('/index');
   /*res.sendFile(__dirname+"/"+"index.html");*/
   console.log("回到首页");
  /* res.send('Hello GET');*/
})
app.get('/index', function (req, res) {
   var indexflag=false;
   for(var i=0;i<loginIngInfo.length;i++){
      if(loginIngInfo[i].userName == req.query.userName){
         indexflag=true;
      }
   }
   if(indexflag){
      res.sendFile(__dirname+"/"+"index.html");
   }else{
      console.log(123);
      res.redirect("/login");
   }
   console.log(loginIngInfo);
})
//  POST 请求
app.post('/', function (req, res) {
   console.log("主页 POST 请求");
   res.send('Hello POST');
})
}
module.exports = sss;