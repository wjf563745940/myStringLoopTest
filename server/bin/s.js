var loopback = require('loopback');
var boot = require('loopback-boot');
var redis=require("redis");
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
//var app2=require("express");
var filter=require("../bin/lib/filter");
var app = express();
var app2 = module.exports = loopback();
var http=require("http").Server(app);
var io=require("socket.io")(http);
var roleService=require('../service/roleService');
var tagService=require('../service/tagService');
var userService=require('../service/userService');
var adminService=require("../service/adminService")
//var Tag=require("../../common/models/tag");

var server = require("../server");
var Consumer=server.models.consumer;
app.use(cookieParser());
app.use(session({
	secret:'keyboard ca',
	name:'userx',
	key:'11',
	cookie:{secure:false},
	resave:false,
	saveUninitialized:false
}));
app.use(bodyParser.urlencoded({    
  extended: true
}));
app.use(function(req, res, next){
  // if (req.is('text/*')) {
  //   req.text = '';
  //   req.setEncoding('utf8');
  //   req.on('data', function(chunk){ req.text += chunk });
  //   req.on('end', next);
  // } else {
  //   next();
  // }
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  console.log(req.originalUrl)
  console.log(req.session)
	  if(!(req.originalUrl=="/user/login" || req.originalUrl=="/user/autho")){
	  	if(req.session.user){
	  	next();
	  }else{
	  	res.send({code:999,msg:'请登录'})//可以直接重定向
	  	// res.redirect("http://127.0.0.1:7779/admin/rego/login.html");
	  }
	}else{
		//userService.login(req,res,next);
		next();
	}
  
});
app.get('/', function(req, res){
  res.send('hello world');
});
app.get("/role/createTable",function(req,res){
	roleService.createTable();
	res.send('success');
});
app.get("/role/add",function(req,res){
	roleService.insert([{"id":2,"role_name":"普通","role_right":1}],res)
})
// app2.use(bodyParser.urlencoded({    
//   extended: true
// }));

app.post("/user/loginout",function(req,res,next){
userService.loginout(req,res)
})
app.post("/user/autho",function(req,res,next){
	console.log("----------get autho-------")
	req.session.authos="authos"
	roleService.getautho(req,res,next);
	console.log(req.session)
})
app.post("/user/login",function(req,res,next){

	console.log(req.session.test)
	req.session.test=111
	//允许所有域名访问
	req.session.logins="login"
	userService.login(req,res,req.session);
	console.log("login 执行完毕")
	req.session.b=111;
	console.log(req.session)
	req.session.save()
	//res.send({"code":"200"})
})
// app2.listen(3002,function(){
// 	console.log('success 3002')
// })
app.get("/tag/add",function(req,res){
		console.log("----------------/tag/add---------------")
tagService.insert([{id:1,name:'泛投资',img:'ion-medkit',sel:false},
  {id:2,name:'互联网金融',img:'ion-medkit',sel:false},
  {id:3,name:'汽车之家',img:'ion-medkit',sel:false},
  {id:4,name:'医疗健康',img:'ion-medkit',sel:false},
  {id:5,name:'爱游戏',img:'ion-settings',sel:false},
  {id:6,name:'二次元',img:'ion-medkit',sel:false}],res) ;
	res.send('success');
})
app.get("/user/register",function(req,res){
	res.setHeader("Access-Control-Allow-Origin", "*"); //允许所有域名访问
	console.log("----------------/user/regitser---------------")
		userService.insert({name:req.query.username,password:req.query.password},res);
	//res.send(result);
})
app.get("/user/securing",function(req,res){//赋予权限
	var reslut=userService.updateRole({id:req.query.userId,role_id:req.query.roleId},res);
})
app.get("/user/updateTable",function(req,res){
	userService.updateTable(res);
})
// app.post("/user/login",function(req,res){
// res.setHeader("Access-Control-Allow-Origin", "*"); //允许所有域名访问
// console.log("----------------/user/login---------------")
// console.info(req.body)
// 		userService.login(null,res);
// })
///注册远程地址
//var Tag=app.models.tag;

//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;

io.on('connection', function(socket){
	console.log(' connected.....');
	adminService.startListenClient(io,socket);
	//监听新用户加入
	socket.on('login', function(obj){
		//将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
		socket.name = obj.userid;
		
		//检查在线列表，如果不在里面就加入
		if(!onlineUsers.hasOwnProperty(obj.userid)) {
			onlineUsers[obj.userid] = obj.username;
			//在线人数+1
			onlineCount++;
		}
		
		//向所有客户端广播用户加入
		io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
		console.log(obj.username+'发起了聊天');
		console.log(obj.targetname+'与'+obj.username+"建立了聊天");
	});
	
	//监听用户退出
	socket.on('disconnect', function(){
		//将退出的用户从在线列表中删除
		if(onlineUsers.hasOwnProperty(socket.name)) {
			//退出用户的信息
			var obj = {userid:socket.name, username:onlineUsers[socket.name]};
			
			//删除
			delete onlineUsers[socket.name];
			//在线人数-1
			onlineCount--;
			
			//向所有客户端广播用户退出
			io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
			console.log(obj.username+'退出了聊天室');
		}
	});
	
	//监听用户发布聊天内容
	socket.on('message', function(obj){
		//向所有客户端广播发布的消息
		console.log("我要广播")
		console.log("监听会后message"+obj.chatId)
		io.emit('message'+obj.chatId, obj);
		console.log(obj.user.name+"于"+obj.content.time+"对"+obj.target.name+'说：'+obj.content.content);
	});
	socket.on("messageBroad",function(msg){ 
		console.log("系统发布的消息"+msg);
		io.emit('messageBroad', msg);
	});
	socket.on("msgb",function(msg){ 
		console.log("系统消息"+msg);
		io.emit('msgb', msg);
	});
	socket.on("newFun",function(msg){
		console.log("新功能发布"+msg);
		io.emit('newFun', msg);
	})
  
});



// boot(app, __dirname, function(err) {
//   if (err) throw err;

//   // start the server if `$ node server.js`
//   if (require.main === module)
//    app.listen(3002,function(){ 
// console.log('loopback listening on *:3002');
//    });
   http.listen(3001, function(){
	console.log('http listening on *:3001');
});

// });


function parseJSON(req,res,next){
    var arr = [];
    req.on("data",function(data){
		console.log(arr)
        arr.push(data);
    });
    req.on("end",function(){
        var data= Buffer.concat(arr).toString(),ret;
        try{
            var ret = JSON.parse(data);
        }catch(err){}
        req.body = ret;
        console.log("ret"+ret)
       // next();
    })
}