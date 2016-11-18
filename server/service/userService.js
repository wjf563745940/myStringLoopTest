var app = require("../server");
console.log("-------------userService--------")
var dataSource =app.dataSources.wujf;
var Consumer=app.models.consumer;
var tagService= module.exports={
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
	login:function(item,res){
				Consumer.find({name:"test",password:"test"},function(err,record){
						if(err){ 
								console.log(err);
								return err;
						} 
							console.log("user register",record);
					console.log("------login--done--------");
					res.send("login success");

				})
	}
};
