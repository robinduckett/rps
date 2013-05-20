var RPS = require('game/rps')._RPS;

suite('rps', function() {
	var rps = new RPS();

	test('generate returns a number which is >= 0 and <= responses.length', function() {
		rps.init();

		var generated = rps.generate();

		assert.ok(generated >= 0 && generated <= rps.responses.length());
	});

	test('generate returns a different number each time so that the user gets a different game each time', function() {
		rps.init();

		var generated = [];
		var success = true;

		for (var i = 0; i < 50; i++) {
			var number = rps.generate();

			generated.push(number);

			if (i > 0) {
				if (number == generated[i - 1]) {
					success = false;
					break;
				}
			}
		}

		if (!success) {
			assert.fail(!success, success, 'expected game to be different');
		} else {
			assert.ok(success, JSON.stringify(generated));
		}
	});

	test('rps result returns an actual response', function() {
		rps.init()
		var result = rps.result();

		assert.include(['rock', 'paper', 'scissors'], result);
	});
});