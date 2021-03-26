# Rebuilding an Imperatively-Coded Game from Scratch in React

The game we'll be (re)-building! [The Guessing Game](https://shapirodaniel.github.io/guessing-game)

If you’re anything like me, you have at least one fun side project written when you were green enough around the ears to have coded it imperatively. When I joined Fullstack Academy in 2020, I had just written a recipe management tool for bread bakers (check it out! breadbakersfriend.com), and knowing exactly zilch about frameworks, I built my next webapp -- a guessing game played on a 10 x 10 grid of numbers between 1 and 100 -- with all my new imperative tricks.

While the game logic could definitely stand a refactor, the game mechanics -- everything that you could pin down as a response to a user interaction -- this is where the real benefit of a (_insert sunglasses meme_) React-ive framework will make itself known.

## Tell me what you want (what you really, really want)

The tough part about imperative programming is that you have to exhaustively document the steps it takes to bring about an effect. React frees up mental resources by allowing you to describe what you want to happen, rather than how you want it to happen. Here’s a concrete example of just how much space for thought React will give you when you turn over micromanagement of the DOM. In the guessing game we’ll be refactoring, take a look at how the grid is built in imperative style.

First, we build an “odd row” template that we’ll fill with numbers, ex. the first row of our grid. (I built an “even row” as well, which I’ll leave to your imagination…)

```html
<!-- hidden odd-row template -->
<div class="odd-row template">
	<span class="lightSquare"></span>
	<span class="darkSquare"></span>
	<span class="lightSquare"></span>
	<span class="darkSquare"></span>
	<span class="lightSquare"></span>
	<span class="darkSquare"></span>
	<span class="lightSquare"></span>
	<span class="darkSquare"></span>
	<span class="lightSquare"></span>
	<span class="darkSquare"></span>
</div>
```

Next we specify a “playing field”. If you’ve spent any time with React, this strategy mirrors the framework’s approach to rendering your app from a “root” div.

```html
<!-- playing field -->
<div class="playing-field"></div>
```

Finally, in our Game class, we call `buildPlayingField()` to construct our grid, and `assignNodeVals()` to assign each a number from 1 to 100.

```javascript
buildPlayingField() {
  for (let i=0; i<10; i++) {
    let newRow = i % 2 === 0 ? evenRow.cloneNode(true) : oddRow.cloneNode(true);
    newRow.classList.toggle('template');
    playingField.appendChild(newRow);
  }
}

assignNodeVals() {
  let nodes = Array.from(document.querySelectorAll('.playing-field span'));
  let array100 = new Array(100).fill(null).map((val, i) => val = i+1);

  nodes.forEach((node, i) => {
    node.innerText = array100[i];
    node.id = node.innerText;
  });
}
```

In React, we are encouraged to think of the operations that conspire to create a new DOM object as a list of instructions detailing what we’d like to see. Translating our imperatively-coded playing field into a functionally-oriented React component, we might end up with something like this -- first, a subcomponent named `Row` that renders a single row of a checkerboard pattern.

```javascript
const Row = ({ scalar }) => {
	const pattern = () => {
		return (scalar / 10) % 2 === 0
			? ['lightSquare', 'darkSquare']
			: ['darkSquare', 'lightSquare'];
	};

	return (
		<div className='row'>
			{new Array(10).fill(null).map((empty, idx) => {
				const [oddSquare, evenSquare] = pattern();

				return (
					<span
						key={idx}
						className={idx % 2 === 0 ? oddSquare : evenSquare}
					>
						{idx + 1 + scalar}
					</span>
				);
			})}
		</div>
	);
};
```

Next, we create a `PlayingField` component that will map a list of “scalars” -- these are the numbers we want each row to start from -- and pass the scalar to the `Row` subcomponent.

```javascript
const PlayingField = () => {
	const scalars = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];

	return (
		<div className='playingField'>
			{scalars.map(scalar => (
				<Row key={scalar} scalar={scalar} />
			))}
		</div>
	);
};
```

The benefits of writing functional React components rather than imperative code aren’t immediately known in this example: in a vacuum, we wrote more code to accomplish the same task. Keeping in mind that code is more often read than written, the real power of React lies in its intelligibility due to encapsulation and its bias towards functional programming. In our React playing field, the total logic of the board is housed in one function, and rather than exhaustively document how the app should build the DOM, we describe what we’d like to see and let React take care of the rest.

## “States are great engines, moving slowly.” (Francis Bacon)

React really shines when it comes to state management -- keeping track of all the values that add up to a “situation” the user has found themselves in, in the midst of using our app or in this particular case, playing our guessing game. Bacon’s aphorism lets us know why: state is a sprawling affair that crawls and branches in many directions from the moment the user loads our app, and to cover every case that could crop up in state imperatively is tantamount to the spinning plates trick -- to avoid a pile of broken ceramics, each event has to be handled precisely in sequence.

The likeliest candidate to benefit from a React refactor in our game’s codebase is a monolithic function `clickHandler` that handles all click events:

```javascript
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
			case 'You Win!' || 'You Lose.':
				break;
			case "You're burning up!":
				break;
			case "You're lukewarm.":
				break;
			case "You're a bit chilly.":
				break;
			case "You're ice cold!":
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
```

This function performs several side effects:

1. Handle clicks on the checkboxes that hold game difficulty settings (easy to jedi) and either:

-   ignore a click to an already-selected checkbox, or
-   toggle the active class on the selected checkbox and start a new game

2. Check for a click on the play again button and ignore any non-play again clicks if game is in a “final” state (lost or won)

At this point, since we’ve eliminated the possibility of the user having selected either a game level or a play again, we check for other sorts of selections, starting with a playing field square or “game node” first:

3. If a game node was selected, we assign it the `currentChoice` selector and assign the `userGuess` field’s innerText value to the game node’s innerText value

4. Otherwise, we check if the user has selected the “submit guess” button, send the `userGuess` value to a validator function `playersGuessSubmission(num)` that calls a reducer function `checkGuess()` that returns an outcome given to a `playerMessage` node, updates remaining guesses, and clears hints

This fourth `handleClick` check is particularly and problematically complicated -- this sequence of events leads to at least 3 distinct side effects that are increasingly remote from the immediate effect of pressing the submit button (which is, of course, to submit a user guess). And, we’re not done yet -- we haven’t handled the “hint” functionality! This fifth `handleClick` check really takes the cake:

5. If the user has pressed the “get a hint” button, we first check for max difficulty level (jedi) and return a special player message to let the user know that no hints are given at max difficulty. We then give a separate message to users who are on any level easier than max difficulty if there is one guess remaining. If more than one guess remains, prior hints are cleared, new hints are generated, and a `null` value is pushed to an array that tracks user guesses. (This serves two purposes: we inform the user of a repeat guessed value, which will not count against their score, and we track the number of guesses as a function of the guesses array length.) Finally, we let the user know whether they’ve lost and reveal the winning node if they have.

If we made it this far ...

6. the player pressed the “play again” button, and we reset state to begin a new game.
