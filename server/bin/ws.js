var ws=require("nodejs-websocket");
var game1=null,game1Ready=false;
var server=ws.createServer(function(conn){
	conn.on("text",function(str){
		console.log("收到的信息为"+str)
		if(str==="game1"){
			game1=conn;
			game1Ready=true;
			conn.sendText("sueecee");
		}

	})
setInterval(function(){
		conn.sendText("update");
	},3000);
	conn.on("close",function(code,reason){
		console.log("关闭练级")
	})
	conn.on("error",function(code,reason){
		console.log("异常关闭");
	})
}).listen(8101,function(){ 
	console.log("server 8101")
});