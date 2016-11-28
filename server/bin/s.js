var loopback = require('loopback');
var boot = require('loopback-boot');
var redis=require("redis");

//var app2=require("express");

console.log(io)
var app = module.exports = loopback();
var http=require("http").Server(app);
var io=require("socket.io")(http);
var roleService=require('../service/roleService');
var tagService=require('../service/tagService');
var userService=require('../service/userService');
var adminService=require("../service/adminService")
//var Tag=require("../../common/models/tag");
app.get('/', function(req, res){
  res.send('hello world');
});
app.get("/role/createTable",function(req,res){
	roleService.createTable();
	res.send('success');
})
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
// app.post("/user/login",function(req,res){
// res.setHeader("Access-Control-Allow-Origin", "*"); //允许所有域名访问
// console.log("----------------/user/login---------------")
// console.info(req.body)
// 		userService.login(null,res);
// })
///注册远程地址
var Tag=app.models.tag;

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