var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
//app.use(express.bodyParser());
var bodyParser = require('body-parser');

// see https://github.com/expressjs/body-parser
// 添加 body-parser 中间件就可以了
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));



var user_Data=[];
var loginIngInfo=[];
var readerStream = fs.createReadStream('data/userData.txt');
// 设置编码为 utf8。
readerStream.setEncoding('UTF8');
// 处理流事件 --> data, end, and error
readerStream.on('data', function (chunk) {
   this.json = JSON.parse(chunk);
   user_Data=this.json;
});
readerStream.on('end',function(){
   console.log(user_Data);
});
readerStream.on('error', function(err){
   console.log(err.stack);
});






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
      res.redirect("/login");
   }
   console.log(loginIngInfo);
   /*i++;
   str["num"+i]=i;
   console.log("第"+i+"个人进入页面");*/
   // console.log("主页 GET 请求"); 
  /* res.send('Hello GET');*/
})
//  POST 请求
app.post('/', function (req, res) {
   console.log("主页 POST 请求");
   res.send('Hello POST');
})

//  /del_user 页面响应
app.get('/del_user', function (req, res) {
   console.log("/del_user 响应 DELETE 请求");
   console.log(str);
   /*str.delete("num"+i);
   console.log(str);*/
   /*res.sendFile(__dirname+"/"+"deluser.html");*/
})
app.post('/logout', function (req, res) {
   console.log('用户'+req.body.userName+'离开本网站');
   for(var i=0;i<loginIngInfo.length;i++){
      if(loginIngInfo[i].userName==req.body.userName){
         loginIngInfo.splice(i, 1);
         break;
      }
   }
   console.log(loginIngInfo);

})
app.post('/del_user', function (req, res) {
   console.log('删除用户'+req.body.userName);

})

app.get('/add_user',function (req,res){
   console.log('添加用户信息');
   var newUser = {
      userName:"123",
      passWord:"123",
   }
   user_Data.push(newUser);


})

app.post('/add_user',function (req,res){
   console.log("添加用户");
   var addflag=true;
   var msg="";
   var addUserinfo={
      userName:req.body.userName,
      passWord:req.body.passWord,
   }
   if(user_Data.length!=0){
      for(var i=0;i<user_Data.length;i++){
         if(user_Data[i].userName == addUserinfo.userName){
            addflag=false;
            break;
         }
      }
   }
   
   if(addflag){
      user_Data.push(addUserinfo);
      var writerStream = fs.createWriteStream('data/userData.txt');
      var str=JSON.stringify(user_Data);
      // 使用 utf8 编码写入数据
      writerStream.write(str,'UTF8');
      // 标记文件末尾
      writerStream.end();
      // 处理流事件 --> data, end, and error
      writerStream.on('finish', function() {
          console.log("写入完成。");
      });

      writerStream.on('error', function(err){
         console.log(err.stack);
      });
      console.log(user_Data);
      msg="添加成功";
   }else{
      msg="已存在该用户";
      console.log('已存在该用户');
      console.log(user_Data);
   }
   res.send(msg);
})


//  /list_user 页面 GET 请求
app.get('/list_user', function (req, res) {
   console.log("/list_user GET 请求");
   res.send(user_Data);
   // 创建可读流
   var readerStream = fs.createReadStream('data/output.txt');
   var writerStream = fs.createWriteStream('data/input.txt');
   // 设置编码为 utf8。
   readerStream.setEncoding('UTF8');

   // 处理流事件 --> data, end, and error
   readerStream.on('data', function(chunk) {
      this.json = JSON.parse(chunk);
      console.log(this.json.name);
      this.data += chunk;
   });
   readerStream.on('end',function(){
      // delete this.json.name;
      this.json.a=[1,2,3,4,5];
      this.json.a.splice(1, 1);
      console.log(this.json);
      res.send(this.json);
      var str=JSON.stringify(this.json);
      // 使用 utf8 编码写入数据
      writerStream.write(str,'UTF8');

      // 标记文件末尾
      writerStream.end();
   });
   readerStream.on('error', function(err){
      console.log(err.stack);
   });

})

app.get('/login', function (req, res) {   
   console.log("登录界面");
   res.sendFile(__dirname+"/"+"login.html");
})
app.post('/check', function (req, res) { 
   // res.writeHead(200, {'Content-Type': 'text/plain'});
   console.log("校验登录信息");
   var msg;
   for(var i=0;i<user_Data.length;i++){
      if(user_Data[i].userName == req.body.userName && user_Data[i].passWord == req.body.passWord){
         var info={
            userName:req.body.userName,
            passWord:req.body.passWord,
         }


         var loginequalsflag=false;
         for(var i=0;i<loginIngInfo.length;i++){
            if(loginIngInfo[i].userName==info.userName){
               loginequalsflag=true;
               break;
            }
         }
         if(loginequalsflag){
            msg="该用户已登录";
         }else{
            loginIngInfo.push(info);
            msg="通过";
         }
         break;
      }else{
         msg="账号密码错误";
      }
   }
   console.log(msg);
   res.send(msg);
})
// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
app.get('/ab*cd', function(req, res) {   
   console.log("/ab*cd GET 请求");
   res.send(user_Data);
})


//
app.post('/getUserInfo', function (req, res) {
   for(var i=0;i<loginIngInfo.length;i++){
      if(loginIngInfo[i].userName == req.body.userName){
         var selected=i;
      }
   }
   res.send(loginIngInfo[selected]);
})

var server = app.listen(8081, function (req, res) {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})