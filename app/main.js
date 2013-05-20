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