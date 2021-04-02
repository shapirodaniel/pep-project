/* ---- GUESSING-GAME ---- */

function generateWinningNumber() {
	let rand = Math.ceil(Math.random() * 100);
	while (rand === this.winningNumber) {
		rand = Math.ceil(Math.random() * 100);
	}
	return rand;
}
function newGame() {
	return new Game();
}
function shuffle(arr) {
	let remaining = arr.length,
		temp,
		curr;
	while (remaining) {
		curr = Math.floor(Math.random() * remaining--);
		temp = arr[remaining];
		arr[remaining] = arr[curr];
		arr[curr] = temp;
	}
	return arr;
}
function getMaxGuesses() {
	switch (difficulty()) {
		case 'easy':
			return 5;
		case 'medium':
			return 4;
		case 'hard':
			return 3;
		case 'expert':
			return 2;
		case 'jedi':
			return 1;
	}
}
function getNumHints() {
	switch (difficulty()) {
		case 'easy':
			return 5;
		case 'medium':
			return 10;
		case 'hard':
			return 15;
		case 'expert':
			return 20;
		case 'jedi':
			return 0;
	}
}
class Game {
	constructor() {
		this.playersGuess = null;
		this.pastGuesses = [];
		this.winningNumber = generateWinningNumber();
		this.maxGuesses = getMaxGuesses();
		this.numHints = getNumHints();
	}
	difference() {
		return Math.abs(this.playersGuess - this.winningNumber);
	}
	playersGuessSubmission(num) {
		num = Number(num);
		if (num < 1 || num > 100 || isNaN(num)) {
			throw 'That is an invalid guess.';
		}
		this.playersGuess = num;
		return this.checkGuess();
	}
	checkGuess() {
		// update guesses before checking if lost!
		let won = this.playersGuess === this.winningNumber;
		let alreadyGuessed = this.pastGuesses.includes(this.playersGuess);
		let novelGuess =
			!this.pastGuesses.includes(this.playersGuess) &&
			this.playersGuess !== this.winningNumber;
		if (novelGuess) {
			this.pastGuesses.push(this.playersGuess);
		}

		// adjust guess count, reveal winning node if lost
		let lost = this.pastGuesses.length === this.maxGuesses;
		let burningUp = this.difference() < 10;
		let lukeWarm = this.difference() < 25;
		let bitChilly = this.difference() < 50;
		let iceCold = this.difference() < 100;
		if (lost) {
			game.revealWinningNode();
		}

		// return game message
		switch (true) {
			case won:
				return 'You Win!';
			case alreadyGuessed:
				return 'You have already guessed that number.';
			case lost:
				return 'You Lose.';
			case burningUp:
				return "You're burning up!";
			case lukeWarm:
				return "You're lukewarm.";
			case bitChilly:
				return "You're a bit chilly.";
			case iceCold:
				return "You're ice cold!";
		}
	}
	provideHint() {
		let hints = new Array(this.numHints - 1),
			alreadyPicked = [this.winningNumber];
		for (let i = 0; i < hints.length; i++) {
			hints[i] = generateWinningNumber();
			while (alreadyPicked.includes(hints[i])) {
				hints[i] = generateWinningNumber();
			}
			alreadyPicked.push(hints[i]);
		}
		hints.push(this.winningNumber);
		return hints;
	}
	// extra functionality
	buildPlayingField() {
		for (let i = 0; i < 10; i++) {
			let newRow =
				i % 2 === 0 ? evenRow.cloneNode(true) : oddRow.cloneNode(true);
			newRow.classList.toggle('template');
			playingField.appendChild(newRow);
		}
	}
	assignNodeVals() {
		let nodes = Array.from(
			document.querySelectorAll('.playing-field span')
		);
		let array100 = new Array(100).fill(null).map((val, i) => (val = i + 1));

		// optional hard mode functionality:
		// let shuffled1to100 = shuffle(array100);

		nodes.forEach((node, i) => {
			node.innerText = array100[i];
			// node.innerText = hardMode ? shuffled1to100[i] : array100[i];
			node.id = node.innerText;
		});
	}
	revealWinningNode() {
		let winningNode = document.getElementById(this.winningNumber);
		let winLoseClass =
			playerMessage.innerText === 'You Win!' ? 'won' : 'lost';
		winningNode.classList.toggle(winLoseClass);
		if (winLoseClass === 'won') {
			winningNode.classList.remove('currentChoice');
		}
		updateWinStreak();
	}
}

/* ---- INIT GAME --- */

// assign vars
const gameNodes = () => {
	return Array.from(document.querySelectorAll('.playing-field span'));
};
const body = document.querySelector('body');
const playingField = document.querySelector('.playing-field');
const oddRow = document.querySelector('.odd-row.template');
const evenRow = document.querySelector('.even-row.template');
const playerMessage = document.querySelector('.player-message');
const userGuess = document.querySelector('.user-guess');
const submitGuessBtn = document.querySelector('#submit-guess-btn');
const hintBtn = document.querySelector('#hint-btn');
const playAgainBtn = document.querySelector('#play-again-btn');
const winStreak = document.querySelector('.winstreak');
const remainingGuesses = document.querySelector('.remaining-guesses');
const numberOfGuessesLeft = () => {
	return Number(
		remainingGuesses.innerText[remainingGuesses.innerText.length - 1]
	);
};
const difficulty = () => {
	return document.querySelector('.checkbox.active + .level-identifier')
		.innerText;
};

// closure tracks winstreak
function getWinStreakFunc() {
	let winStreakCount = 0;
	return function () {
		if (playerMessage.innerText === 'You Win!') {
			winStreakCount++;
		} else {
			winStreakCount = 0;
		}
		winStreak.innerText = `Current Win Streak: ${winStreakCount}`;
	};
}
const updateWinStreak = getWinStreakFunc();

// build playing field, assign numbers to nodes
function initializeGame() {
	this.buildPlayingField();
	this.assignNodeVals();
}
let game = newGame();
initializeGame.call(game);

/* ---- EVENT HANDLING ---- */

// difficulty switch functionality
function isCheckBox(e) {
	return e.target.matches(
		'.checkmark, .checkbox, .level-identifier, .difficulty-switch-box'
	);
}
function getCheckBoxNode(e) {
	switch (true) {
		case e.target.matches('.checkmark'):
			return e.target.parentElement;
		case e.target.matches('.checkbox'):
			return e.target;
		case e.target.matches('.level-identifier'):
			return e.target.previousElementSibling;
		case e.target.matches('.difficulty-switch-box'):
			return Array.from(e.target.children)[0];
	}
}

// playAgainBtn functionality
function playAgain() {
	// clear items for initialization
	playingField.innerHTML = '';
	userGuess.innerText = '';
	playerMessage.innerText = '';
	// initalize game and set guesses
	game = newGame();
	initializeGame.call(game);
	remainingGuesses.innerText = `Remaining Guesses: ${game.maxGuesses}`;
}

// gameplay
function clickHandler(e) {
	// checkbox needs to be evaluated first!
	// always functional
	// calls initializeGame() after setting checkbox by clicking playAgainBtn
	if (isCheckBox(e)) {
		// do nothing if already checked
		if (e.target.matches('.active')) {
			return;
		}
		document.querySelector('.checkbox.active').classList.toggle('active');
		getCheckBoxNode(e).classList.toggle('active');
		playAgain();
	}

	// suspend actions except play again btn if lost
	let lost = playerMessage.innerText === 'You Lose.';
	let won = playerMessage.innerText === 'You Win!';
	let playAgainBtn = e.target.matches('#play-again-btn');
	if ((lost || won) && !playAgainBtn) {
		return;
	}

	// gameNode
	if (gameNodes().some(node => e.target === node)) {
		gameNodes().forEach(node => node.classList.remove('currentChoice'));
		e.target.classList.add('currentChoice');
		userGuess.innerText = e.target.id;
	}

	// submit-guess-btn
	if (e.target.matches('#submit-guess-btn')) {
		// update playerMessage and toggle won/lost class on winning node
		let outcome = game.playersGuessSubmission(userGuess.innerText);
		playerMessage.innerText = outcome;
		if (playerMessage.innerText === ('You Win!' || 'You Lose.')) {
			game.revealWinningNode();
		}
		// opt. functionality for changing color scheme according to how close guess is
		switch (outcome) {
			case 'You Win!' ||
				'You Lose.' /* win / lose modal, split this condition... */:
				break;
			case "You're burning up!" /* toggle hot scheme */:
				break;
			case "You're lukewarm." /* toggle warm scheme */:
				break;
			case "You're a bit chilly." /* toggle chilly scheme */:
				break;
			case "You're ice cold!" /* toggle cold scheme */:
				break;
		}
		// update remaining guesses
		remainingGuesses.innerText = `Remaining Guesses: ${
			game.maxGuesses - game.pastGuesses.length
		}`;
		// clear hints
		gameNodes()
			.filter(node => node.classList.contains('hint'))
			.forEach(node => node.classList.remove('hint'));
	}

	// hint-btn
	if (e.target.matches('#hint-btn')) {
		// no hints for jedi
		if (difficulty() === 'jedi') {
			playerMessage.innerText = 'Reach out with your feelings...';
			return;
		}
		// disable if one guess remaining
		if (numberOfGuessesLeft() === 1) {
			playerMessage.innerText =
				'Not enough guesses left to hint...go for it!';
			return;
		}
		// clear prior hints
		gameNodes()
			.filter(node => node.matches('.hint'))
			.forEach(node => node.classList.toggle('hint'));
		// get new hints and assign to nodes
		game.provideHint()
			.map(val => document.getElementById(val))
			.forEach(node => node.classList.toggle('hint'));
		// add a null val to pastGuesses, update remainingGuesses
		game.pastGuesses.push(null);
		remainingGuesses.innerText = `Remaining Guesses: ${
			game.maxGuesses - game.pastGuesses.length
		}`;
		if (game.pastGuesses.length === game.maxGuesses) {
			playerMessage.innerText = 'You Lose.';
			game.revealWinningNode();
		}
	}

	// play-again-btn
	if (e.target.matches('#play-again-btn')) {
		playAgain();
	}
}

// assign ELs
body.addEventListener('click', clickHandler);
