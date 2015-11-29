$(function(){

	//EventStreams


	var shapeStream = $('#shape').asEventStream('change')
															 .map(function (event) { return event.target.value; })
									  					 .skipDuplicates()
									  					 .toProperty($('#shape').val());

	var sizeStream = $('#size').asEventStream('keyup mouseup change')
														 .map(function (event) { return parseInt(event.target.value); })
									  				 .skipDuplicates()
									  				 .toProperty(parseInt($('#size').val()));

	var colorStream = $('#color').asEventStream('change')
															 .map(function (event) { return event.target.value; })
									  					 .skipDuplicates()
									  					 .toProperty($('#color').val())
									  					 .map(c => transformColor(c));

	colorStream.log();

	function transformColor(color)
	{
		//console.log(color);
		if (color === 'Red') return "#FF0000";
		if (color === 'Green') return "#00FF00";
		if (color === 'Blue') return "#0000FF";
		return "#000000";
	};

 //ModelStream

 var modelStream = Bacon.combineTemplate({
			shape: shapeStream,
			size: sizeStream,
			color: colorStream
		});
 modelStream.log();

 // Model transformation


 // SideEffects

 var canvas = document.getElementById("canvas");
 var ctx = canvas.getContext('2d');

 modelStream.onValue(m => {
 	drawModel(ctx, m);
 });


 function drawModel(ctx, m)
 {
 	ctx.clearRect(0, 0, canvas.width, canvas.height);
 	ctx.fillStyle = m.color;
 	var x = 100;
 	var y = 100;


 	if(m.shape === 'Square')
 		ctx.fillRect(x,y, m.size, m.size);

 	if(m.shape === 'Circle')
 	{
 		ctx.beginPath();
 		ctx.arc(x+(m.size/2),y+(m.size/2),m.size/2,0, 2*Math.PI);
 		ctx.stroke();
 		ctx.fillStyle = m.color;
		ctx.fill();
 	}
 		
 	if(m.shape === 'Triangle')
 	{
 		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x, y+m.size);
		ctx.lineTo(x+m.size, y+m.size);
		ctx.closePath();
		 
		// the fill color
		ctx.fillStyle = m.color;
		ctx.fill();
 	}
 }


});