var app = require("../server");
console.log("-------------role table--------")
var tagService= module.exports={
	createTable:function(){
		var dataSource =app.dataSources.wujf;
			dataSource.automigrate('role',function(err){
		if(err) throw err;
		console.log("-------------role table-- success------")
 })
	}
};
