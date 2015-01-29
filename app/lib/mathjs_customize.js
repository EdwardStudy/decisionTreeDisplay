

var mathjs = require('mathjs')

mathjs.import({
	"discount": function(v,rate,times){
		return v*Math.pow(1-rate, times);
	}
})



exports.gen_graph = function(var_array){
	var graph = {};
	for (var i = var_array.length - 1; i >= 0; i--) {
		var v = var_array[i];
		mathjs.compile(v);
	}

	
};



exports.mathjs = mathjs