'use strict';

module.exports = function(Tag) {
	Tag.test=function(msg,cb){ 
				cb(null,"success"+msg);
		}
		Tag.remoteMethod('test',{ 
				accepts:{arg:'msg',type:'string'},
				returns:{arg:'test',type:"string"}
		})
};
