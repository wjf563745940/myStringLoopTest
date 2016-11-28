var loopback = require('loopback');
var http=require("http").Server(loopback());
//var io=require("socket.io")(http);
var adminService=module.exports={
	startListenClient:function(io,socket){
		console.log(1111)
			console.log(' adminService connected.....');
			socket.on("visitor",function(obj){
				console.log(' adminService connected....有人访问.');
			socket.name=obj.userid;
			//插入数据库
			io.emit('visitor',{"visitorName":obj.username});
			console.log("有人访问了")
			});
			socket.on("connectChat",function(obj){
				console.log(obj)
				console.log("connectChat xx跟xx建立了回话");
				//插入数据库
				io.emit("connectChat",{"msg":obj})
			})
	}
}