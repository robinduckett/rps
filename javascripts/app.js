(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("game/responses", function(exports, require, module) {
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
});
window.require.register("game/rps", function(exports, require, module) {
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
});
window.require.register("main", function(exports, require, module) {
  /* main.js */

  var RPS = require('game/rps').instance();

  RPS.init();

  var player_weapon = 'rock';
  var started = false;

  function $(className) {
  	return document.getElementsByClassName(className);
  }

  function addClass(el, className) {
  	var classes = el.className.split(' ');
  	classes.push(className);
  	el.className = classes.join(' ');
  }

  function removeClass(el, className) {
  	var classes = el.className.split(' ');

  	if (classes.indexOf(className) > -1) {
  		classes.splice(classes.indexOf(className), 1);
  	}

  	el.className = classes.join(' ');
  }

  function setupEvents() {
  	var weapons = $('weapon');

  	for (var i = 0; i < weapons.length; i++) {
  		weapons[i].addEventListener('click', weaponClick, false);
  	}

  	detectBrowser();
  }

  function detectBrowser() {
  	navigator.sayswho = (function(){
  		var ua= navigator.userAgent;
  		var M= ua.match(/(opera|chrome|safari|firefox|msie)/i);
  		return M.toString().split(',')[0];
  	})();

  	var players = $('player');

  	for (var i = 0; i < players.length; i++) {
  		if (players[i].className.indexOf('computer') > -1) {
  			players[i].innerHTML = getBrowserCode(navigator.sayswho.toLowerCase());
  		}

  		players[i].addEventListener('click', function(event) {
  			var e = event.target;

  			for (var j = 0; j < players.length; j++) {
  				removeClass(players[j], 'selected');
  			}

  			if (e.className.indexOf("selected") > -1) {
  				removeClass(e, 'selected');
  			} else {
  				addClass(e, 'selected');
  			}

  			if (e.className.indexOf('user') > -1) {
  				startUserGame();
  			} else {
  				startCPUGame();
  			}
  		}, false);
  	}
  }

  function startUserGame() {
  	var player2 = RPS.result();

  	addClass($('weapon-choose')[0], 'show');

  	startShow(undefined, player2);
  }

  function startCPUGame() {
  	var player1 = RPS.result();
  	var player2 = RPS.result();

  	startShow(player1, player2);
  }

  function getWeaponCode(weapon) {
  	switch (weapon) {
  		case "rock":
  			return "&#X574;"
  		break;
  		case "paper":
  			return "&#X575;";
  		break;
  		case "scissors":
  			return "&#X576;";
  		break;
  	}
  }

  function showCountdown(callback) {
  	addClass($('countdown')[0], 'show');

  	var countdownTimer = setInterval(function() {
  		var countdown = $('countdown')[0];
  		var left = parseInt(countdown.innerHTML);

  		if (left > 1) {
  			left--;
  			countdown.innerHTML = left;
  		} else {
  			removeClass(countdown, 'show');
  			callback();
  			clearInterval(countdownTimer);
  		}
  	}, 1000);
  }

  function startShow(player1, player2) {
  	if (started === false) {
  		started = true;

  		showCountdown(function() {
  			if (typeof player1 == "undefined") {
  				player1 = player_weapon;
  			}

  			var result = RPS.responses.result(player1, player2);
  			var player1Element = document.getElementById('player1');
  			var player2Element = document.getElementById('player2');
  			var resultElement = document.getElementById('result');

  			player1Element.innerHTML = getWeaponCode(player1);
  			player2Element.innerHTML = getWeaponCode(player2);
  			resultElement.innerHTML = getResultText(result);
  			addClass(document.getElementById('game'), 'show');
  		});
  	}
  }

  function getResultText(result) {
  	switch (result) {
  		case "win":
  			return "Win!";
  		break;

  		case "lose":
  			return "Lose!";
  		break;

  		case "draw":
  			return "Tie!";
  		break;
  	}
  }

  function getBrowserCode(browser) {
  	switch (browser) {
  		case "chrome":
  			return "&#X40A;";
  		break;
  		case "firefox":
  			return "&#X40D;";
  		break;
  		case "safari":
  			return "&#X40C;";
  		break;
  		case "opera":
  			return "&#X409;";
  		break;
  		case "msie":
  			return "&#X408;";
  		break;
  	}
  }

  function deselectWeapons() {
  	var weapons = document.getElementsByClassName('weapon');

  	for (var i = 0; i < weapons.length; i++) {
  		removeClass(weapons[i], 'selected');
  	}
  }

  function weaponClick(event) {
  	var e = event.target;

  	deselectWeapons();

  	if (e.className.indexOf("selected") > -1) {
  		removeClass(e, 'selected');
  	} else {
  		addClass(e, 'selected');
  	}

  	var weapons = ['rock', 'paper', 'scissors'];

  	weapons.forEach(function(weapon) {
  		if (e.className.indexOf(weapon) > -1) {
  			player_weapon = weapon;
  		}
  	});
  }

  setupEvents();
});
