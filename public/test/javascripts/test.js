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

window.require.register("test/game/responses-test", function(exports, require, module) {
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
});
window.require.register("test/game/rps-test", function(exports, require, module) {
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
});
window.require.register("test/initialize", function(exports, require, module) {
  var test, tests, _i, _len;

  tests = ['./game/rps-test', './game/responses-test'];

  for (_i = 0, _len = tests.length; _i < _len; _i++) {
    test = tests[_i];
    require(test);
  }
  
});
