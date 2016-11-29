var app = require("../server");
var dataSource =app.dataSources.wujf;
var Consumer=app.models.consumer;
var tableService= module.exports={
	updateTable:function(itmes,res){
		items.foreach(function(item){
				dataSource.autoupdate(itme.name, function (err, result) {
				return res.send(itme.name+"更新表成功");
	});
		})

	}
};