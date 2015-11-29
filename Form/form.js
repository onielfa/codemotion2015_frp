$(function(){

	//Model

	function getFormModelEventStream (nameStream, minStream, maxStream)
	{
		return Bacon.combineTemplate({
			name: nameStream,
			min: minStream,
			max: maxStream
		});
	}

	// EventStreams
	var nameStream = $('#name')
									  .asEventStream('keyup')
									  .map(function (event) { return event.target.value; })
									  .skipDuplicates()
									  .toProperty($('#name').val());

	var minStream = $('#min')
									  .asEventStream('keyup')
									  .map(function (event) { return parseInt(event.target.value); })
									  .skipDuplicates()
									  .toProperty(parseInt($('#min').val()));

	var maxStream = $('#max')
									  .asEventStream('keyup')
									  .map(function (event) { return parseInt(event.target.value); })
									  .skipDuplicates()
									  .toProperty(parseInt($('#max').val()));

	var modelStream = Bacon.combineTemplate({
			name: nameStream,
			min: minStream,
			max: maxStream
		});

	modelStream.log();

	var evaluateStream = modelStream.map(evaluateModel);

	//evaluateStream.onValue(x => console.log(x));

	//Aux

	function evaluateModel(model){
		var message = '';
		if (model.name.length < 3)
			message = message + 'Name should be longer than 3. '
		if (model.min > model.max)
			message = message + 'Min should be less than max. '
		return {
			valid: model.name.length >= 3 && model.min <= model.max,
			message: message
		};
	}

	//Side Effects

	evaluateStream.log();

	evaluateStream.map(function(m) {return !m.valid})
							 .assign($('#submitButton'), 'attr', 'disabled');

	evaluateStream.map(function(m) {return m.message})
							 .assign($('#error'), 'text');

});