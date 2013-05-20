var Responses = require('game/responses');

suite('responses', function() {
	var responses = new Responses();

	test('adding a response should increase the amount of responses', function() {
		responses.add('rock', {
			win: ['scissors'],
			lose: ['paper']
		});

		assert.ok(responses.length() === 1);

		responses.add('scissors', {
			win: ['paper'],
			lose: ['rock']
		});

		assert.ok(responses.length() === 2);
	});

	test('result should return the win/loss/draw of a particular comparison', function() {
		responses.add('rock', {
			win: ['scissors', 'lizard'],
			lose: ['paper', 'spock']
		});

		responses.add('scissors', {
			win: ['paper', 'lizard'],
			lose: ['rock', 'spock']
		});

		responses.add('paper', {
			win: ['rock', 'spock'],
			lose: ['scissors', 'lizard']
		});

		responses.add('lizard', {
			win: ['spock', 'paper'],
			lose: ['rock', 'scissors']
		});

		responses.add('spock', {
			win: ['scissors', 'rock'],
			lose: ['lizard', 'paper']
		});

		var result = responses.result('rock', 'scissors');
		assert.deepEqual(result, 'win');

		var result = responses.result('rock', 'paper');
		assert.deepEqual(result, 'lose');

		var result = responses.result('rock', 'rock');
		assert.deepEqual(result, 'draw');

		var result = responses.result('rock', 'lizard');
		assert.deepEqual(result, 'win');

		var result = responses.result('rock', 'spock');
		assert.equal(result, 'lose');
	});
});