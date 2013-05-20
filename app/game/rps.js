var INSTANCE = null;

var Responses = require('game/responses');

function RPS() {
}

RPS.prototype.init = function() {
	var responses = this.responses = new Responses();

	responses.add('rock', {
		win: ['scissors'],
		lose: ['paper']
	});

	responses.add('paper', {
		win: ['rock'],
		lose: ['scissors']
	});

	responses.add('scissors', {
		win: ['paper'],
		lose: ['rock']
	});
};

RPS.prototype.generate = function() {
	var random = Math.floor(Math.random() * (this.responses.length()));

	while(random === this.last_generated) {
		random = Math.floor(Math.random() * (this.responses.length()));
	}

	this.last_generated = random;

	return random;
};

RPS.prototype.result = function() {
	return this.responses.get(this.generate());
};

module.exports = {
	_RPS: RPS,
	instance: function() {
		if (INSTANCE === null) {
			INSTANCE = new RPS();
		}

		return INSTANCE;
	}
}