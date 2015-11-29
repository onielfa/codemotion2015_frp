$(function(){
	var up = $('#upButton').asEventStream('click');
	var down = $('#downButton').asEventStream('click');

	var f = function(acc,val) 
	{ 
		return acc + val
	};

	var counter = up
								.map(1)
								.merge(down.map(-1))
								.scan(0, f);
	counter.assign($('#result'), 'text');
});