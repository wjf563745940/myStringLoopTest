var app = require("../server");
console.log("-------------userService--------")
var dataSource =app.dataSources.wujf;
var Consumer=app.models.consumer;
var tagService= module.exports={
	updateTable:function(itme,res){
	dataSource.autoupdate("consumer", function (err, result) {
			console.log(result)
			return result;
	});
	},
	updateRole:function(item,res){
		console.log("search user by id"+item.id)
		Consumer.findById(item.id,function(err, instance){
			if(err) {console.log(err) ;res.send("不存在改用户")}
			console.log("updateRole")
		instance.role_id=item.role_id;
		Consumer.upsert(instance,function(err,record){
			if(err){console.log(err)
				res.send("更新失败")
			}
			res.send("success")
		})
		})
		
	},
	insert:function(item,res){
		// 	dataSource.automigrate('consumer',function(err){
		// if(err) throw err;
				Consumer.create(item,function(err,record){
					if(err) { console.log(err)
							return err;
					};
					console.log("user register",record);
					console.log("--------done--------");
					//dataSource.disconnect();
					res.send("success")
				})
				console.log("---automigrate------")

 // })
		console.log("---return------")		
	},
	loginold:function(item,res){
				Consumer.find({name:"test",password:"test"},
					function(err,record){
						if(err){ 
								console.log(err);
								return err;
						} 
							console.log("user register",record);
					console.log("------login--done--------");
					res.send("login success");

				})
	},
	login:function(req,res,session){
		var obj=req.body;
		console.log("login-------------------...")
		Consumer.find({where: {name:obj.username,password:obj.password}}
			,function(err,consumers){
				if(err){
					console.log(err)
				res.send({"code":401,"msg":"登录失败,服务器响应失败"})	
			} else{
				console.log(consumers)
				if(consumers.length==0){
					res.send({"code":302,"msg":"登录失败,用户名或密码错误","data":null})
				}else{
					console.log("登录成")
					//req.session.user = consumers[0];
					res.send({"code":200,"msg":"登录成功","data":consumers[0]})
				}
				
			}
		})
	},
	loginOut:function(req,res){
		req.session.user=null;
		res.send({"code":200,"msg":"登出成功","data":null})
}

}