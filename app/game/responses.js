function Responses() {
	this.responses = {};
}

Responses.prototype.add = function(response, options) {
	this.responses[response] = options;
};

Responses.prototype.get = function(index) {
	var count = 0;

	for (var response in this.responses) {
		if (this.responses.hasOwnProperty(response)) {
			if (count === index) {
				return response;
			} else {
				count++;
			}
		}
	}
}

Responses.prototype.length = function() {
	var count = 0;

	for (var response in this.responses) {
		if (this.responses.hasOwnProperty(response)) {
			count++;
		}
	}

	return count;
};

Responses.prototype.find = function(player) {
	if (typeof player !== "undefined") {
		for (var response in this.responses) {
			if (this.responses.hasOwnProperty(response)) {
				if (response === player) {
					return this.responses[response];
				}
			}
		}
	} else {
		var responses = [];
		
		for (var response in this.responses) {
			if (this.responses.hasOwnProperty(response)) {
				responses.push(response);
			}
		}

		return responses;
	}
};

Responses.prototype.result = function(player1, player2) {
	var result = 'draw';

	if (this.find(player1).win.indexOf(player2) > -1) {
		result = 'win';
	} else if (this.find(player1).lose.indexOf(player2) > -1) {
		result = 'lose';
	}

	return result;
};

module.exports = Responses;