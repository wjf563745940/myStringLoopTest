var app = require("../server");
console.log("-------------role table--------")
var Role=app.models.role;
var tagService= module.exports={
	createTable:function(){
		var dataSource =app.dataSources.wujf;
			dataSource.automigrate('role',function(err){
		if(err) throw err;
		console.log("-------------role table-- success------")
 })
	},
	insert(items,res){
		var count =items.length;
		items.forEach(function(item){ 
				Role.create(item,function(err,record){
					if(err) {
					console.log(err);
					res.send("添加失败")	
					}
					console.log("record create",record);
					count--;
					if(count ===0){ 
						res.send("完成")				
					}
				})
		})
	},
	getautho:function(req,res,next){
		console.log("----------get autho---")
	//var user=req.session.user;
	//console.log(user.role_id)
	res.send("success")
}

};
