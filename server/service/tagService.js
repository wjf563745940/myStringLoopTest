var app = require("../server");
console.log("-------------tag--------")

var tagService= module.exports={
	insert:function(datas,res){
		var dataSource =app.dataSources.wujf;
			dataSource.automigrate('tag',function(err){
		if(err) throw err;
		var Tag=app.models.tag;
		var count =datas.length;
		datas.forEach(function(tag){ 
				Tag.create(tag,function(err,record){
					if(err) return console.log(err);
					console.log("record create",record);
					count--;
					if(count ===0){ 
							console.log("--------done--------");
							//dataSource.disconnect();
							
					}
				})
		})

 })
	}
};
