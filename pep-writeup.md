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

Without a state management system, imperative code can quickly spaghettify: take for example this monolithic function `clickHandler` which handles all click events and their associated logic.

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

		// playerMessage generator
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

If we dig in to `clickHandler` we see that there are essentially two kinds of clickable DOM elements our users will interact with during the course of the guessing game: difficulty switches that set the current difficulty level and game-play buttons that generate hints, submit user guesses, and reset the game. What if we had a way of separating the <strong>game logic</strong> from <strong>DOM elements themselves</strong> so that we could reason about them separately? And what if anything would we gain from separating concerns in this way? Let's refactor `clickHandler` by pulling the state logic out, sending the mechanical information ("when the user clicks X, Y happens") to React components and letting them receive state updates from a single source of truth. There are several state management systems available to the React ecosystem, and given our modest needs, React's Context API is a great fit.

## React Context API

React Contexts are provider components that wrap part (or all) of React's virtual DOM and make a global state context available to all children downstream of the context provider. As a component themselves they have access to all of the class/functional component APIs.

We've seen that our state logic often involves a few distinct DOM elements changing at once. For instance, when a user requests a hint:

-   hints are generated and classes are assigned to reflect them
-   the user's remaining guesses are decremented
-   the active tile representing the user's choice is reset
-   conditional logic relating to hints is triggered if hints aren't available due to a low remaining guesses count or a high difficulty level

React allows us to flip this imperative model of data flow on its head and pass state to elements, rather than manipulate state inside the DOM. Let's make use of React's `useReducer` hook to modify our global state by issuing <strong>actions</strong> to a reducer, which is just a function that returns an updated state given an action type and a payload of state modifications.

Our app lets users take 5 distinct actions: set the difficulty level, select a square, submit the selected square as a guess, get hints, and reset the game. If we restrict the ability of users to change difficulty levels mid-game, then we really only have four interactions:

```javascript
const START_GAME = 'START_GAME';
const PLAYER_GUESSED = 'PLAYER_GUESSED';
const PLAYER_REQUESTED_HINT = 'PLAYER_REQUESTED_HINT';
const SELECT_NEW_SQUARE = 'SELECT_NEW_SQUARE';
```

Our reducer will take in the current state, initialized as follows (where objects ending in `*Lib` are string libraries that hold variables mapped to difficulty, progress, and player messages, as well as number libraries that hold amounts of hints and guesses):

```javascript
const initState = {
	difficulty: 'EASY',
	pastGuesses: [],
	winningNumber: Math.ceil(Math.random() * 100),
	currentHints: [],
	maxGuesses: 5,
	numHints: 5,
	selectedSquare: 0,
	currentProgress: progressesLib.PLAYING,
	playerMessage: playerMessagesLib.START_MESSAGE,
	currentWinstreak: localStorage.getItem('winstreak') || 0,
};
```

Whenever the user takes action an object is <em>dispatched</em> or sent to the reducing function, which will switch on the action type -- this is a message relayed to the reducer by the DOM element that captured the user action described by the <strong>dispatched</strong> message. With our dispatch action types in hand, let's put all the pieces together:

```javascript
const reducer = (state, { type, payload }) => {
	switch (type) {
		// payload: { difficulty: /* the current difficulty constant */}
		case START_GAME: {
			return {
				...initState,
				difficulty: payload.difficulty,
				winningNumber: Math.ceil(Math.random() * 100),
				maxGuesses: guessesLib[payload.difficulty],
				numHints: hintsLib[payload.difficulty],
				currentProgress: progressesLib.PLAYING,

				// store winstreak in local storage
				currentWinstreak: localStorage.getItem('winstreak'),
			};
		}

		case SELECT_NEW_SQUARE: {
			return {
				...state,
				currentHints: [],
				selectedSquare: payload.selectedSquare,
			};
		}

		case PLAYER_GUESSED: {
			// if player has not selected a square before clicking submit guess btn
			if (!payload.selectedSquare)
				return {
					...state,
					currentHints: [],
					playerMessage: playerMessagesLib.PLEASE_CHOOSE_A_SQUARE,
				};

			// if player has already made that guess
			if (state.pastGuesses.includes(payload.selectedSquare))
				return {
					...state,
					playerMessage: playerMessagesLib.ALREADY_GUESSED,
				};

			// if player has won
			if (payload.selectedSquare === state.winningNumber) {
				const newState = {
					...state,
					currentProgress: progressesLib.WON,
					playerMessage: playerMessagesLib.YOU_WIN,
					currentWinstreak: state.currentWinstreak++,
				};

				localStorage.setItem('winstreak', newState.currentWinstreak);

				return newState;
			}

			// otherwise process
			const newState = {
				...state,
				pastGuesses: [...state.pastGuesses, payload.selectedSquare],
				playerMessage: getPlayerMessage(
					payload.selectedSquare,
					state.winningNumber
				),
			};

			// if lost
			if (newState.pastGuesses.length === newState.maxGuesses) {
				localStorage.setItem('winstreak', 0);

				return {
					...newState,
					currentProgress: progressesLib.LOST,
					playerMessage: playerMessagesLib.YOU_LOSE,
					currentWinstreak: 0,
				};
			}

			// otherwise, keep playing
			return newState;
		}

		case PLAYER_REQUESTED_HINT: {
			// if player is jedi
			if (state.difficulty === difficultiesLib.JEDI) {
				return {
					...state,
					playerMessage: playerMessagesLib.JEDI_HINT,
				};
			}

			// if player has no hints left
			if (state.maxGuesses - state.pastGuesses.length === 1) {
				return {
					...state,
					playerMessage: playerMessagesLib.NOT_ENOUGH_GUESSES_LEFT,
				};
			}

			// otherwise, get new hints
			return {
				...state,
				currentHints: getNewHints(
					hintsLib[state.difficulty],
					state.winningNumber
				),
				playerMessage: playerMessagesLib.CLEAR_MESSAGE,
				pastGuesses: [...state.pastGuesses, null],
			};
		}

		default:
			return state;
	}
};
```

The provider component we'll use to pass `state` and the `dispatch` method to downstream components relies on the provider wrapping its subtree, which we allow it to do with `props.children`:

```javascript
const GameProvider = ({ children }) => {
	// useReducer takes initState as an arg
	// rather than the redux convention of setting default state
	// as a rest parameter on the reducer function itself
	const [state, dispatch] = useReducer(reducer, initState);

	const providerValue = {
		state,
		dispatch,
		difficultiesLib,
		progressesLib,
		PLAYER_GUESSED,
		PLAYER_REQUESTED_HINT,
		START_GAME,
		SELECT_NEW_SQUARE,
	};

	return (
		<GameContext.Provider value={providerValue}>
			{children}
		</GameContext.Provider>
	);
};
```

Now we wrap the component and its children in a `GameProvider`, and at whatever level we place the provider, all descendants will have access to its `GameContext` containing the `state` and `dispatch` methods that we'll use to modify state inside the components that actually perform that work!

```javascript
function App() {
	return (
		<GameProvider>
			<div className='App'>
				<div className='wrapper'>
					<div className='main'>
						<h1>
							THE <span className='h1-emphasis'>GUESSING</span>{' '}
							GAME
						</h1>
						<PlayingField />
						<Stats />
					</div>
					<Sidebar />
				</div>
			</div>
		</GameProvider>
	);
}
```

We've come full circle to our `PlayingField`, where we'll see that the `Row` subcomponent now renders the game static without knowing "how" or what caused state to change -- it simply renders the new state -- and it accesses state not through prop-drilling, but on the `GameContext` with the `useContext` hook.

```javascript
const Row = ({ scalar }) => {
	const { state, dispatch, progressesLib, SELECT_NEW_SQUARE } = useContext(
		GameContext
	);

	const pattern = () => {
		return (scalar / 10) % 2 === 0
			? ['lightSquare', 'darkSquare']
			: ['darkSquare', 'lightSquare'];
	};

	return (
		<div className='row'>
			{new Array(10).fill(null).map((empty, idx) => {
				const [oddSquare, evenSquare] = pattern();

				const squareValue = idx + 1 + scalar;

				const getClassName = () => {
					const squareType = idx % 2 === 0 ? oddSquare : evenSquare;

					const modifier = (() => {
						const won =
							state.currentProgress === progressesLib.WON &&
							squareValue === state.winningNumber;

						const lost =
							state.currentProgress === progressesLib.LOST &&
							squareValue === state.winningNumber;

						const currentChoice =
							state.selectedSquare === squareValue &&
							state.currentProgress === progressesLib.PLAYING;

						const hint = state.currentHints.includes(squareValue);

						switch (true) {
							case won:
								return ' won';
							case lost:
								return ' lost';
							case currentChoice:
								return ' currentChoice';
							case hint:
								return ' hint';
							default:
								return '';
						}
					})();

					return squareType + modifier;
				};

				return (
					<span
						key={idx}
						className={getClassName()}
						onClick={e => {
							dispatch({
								type: SELECT_NEW_SQUARE,
								payload: {
									selectedSquare: +e.target.innerText,
								},
							});
						}}
					>
						{squareValue}
					</span>
				);
			})}
		</div>
	);
};
```

The `PlayerButtons` component shows the clarity we get from separating concerns: buttons dispatch actions without needing to know how those actions will deliver the new state:

```javascript
const PlayerButtons = () => {
	const {
		state,
		dispatch,
		START_GAME,
		PLAYER_GUESSED,
		PLAYER_REQUESTED_HINT,
		progressesLib,
	} = useContext(GameContext);

	const { selectedSquare } = state || {};

	return (
		<div className='button-wrapper'>
			<input
				type='button'
				id='submit-guess-btn'
				value='SUBMIT GUESS'
				onClick={() => {
					if (state.currentProgress !== progressesLib.PLAYING) return;
					dispatch({
						type: PLAYER_GUESSED,
						payload: {
							selectedSquare,
						},
					});
				}}
			/>
			<input
				type='button'
				id='hint-btn'
				value='GET A HINT'
				onClick={() => {
					if (state.currentProgress !== progressesLib.PLAYING) return;
					dispatch({ type: PLAYER_REQUESTED_HINT });
				}}
			/>
			<input
				type='button'
				id='play-again-btn'
				value='PLAY AGAIN'
				onClick={() =>
					dispatch({
						type: START_GAME,
						payload: {
							difficulty: state.difficulty,
						},
					})
				}
			/>
		</div>
	);
};

export default PlayerButtons;
```

We can easily extend the `START_GAME` logic to our `DifficultySwitches`, allowing us to prevent users from resetting game difficulty in-game without any additional logic! And we have access to our `GameContext` which will let us share `*Lib` constant libraries with components, cutting down on the need for repetitive defintions.

```javascript
const DifficultySwitch = ({ level }) => {
	const { state, dispatch, START_GAME } = useContext(GameContext);

	return (
		<div
			className='difficulty-switch-box'
			onClick={() =>
				dispatch({
					type: START_GAME,
					payload: { difficulty: level },
				})
			}
		>
			<div
				className={
					state.difficulty === level ? 'checkbox active' : 'checkbox'
				}
			>
				<div className='checkmark'></div>
			</div>
			<div className='level-identifier'>{level.toLowerCase()}</div>
		</div>
	);
};

const DifficultySwitches = () => {
	const { difficultiesLib } = useContext(GameContext);

	const levels = Object.keys(difficultiesLib);

	return levels.map(level => <DifficultySwitch key={level} level={level} />);
};

export default DifficultySwitches;
```

## Takeaways

React is a powerful front-end framework that has some great state management APIs baked directly into it, notably its `useReducer` hook in tandem with `useContext`, allowing a sophisticated Redux-like single source of truth to be provided to your entire app, a parrticular feature, or an entirely local environment for managing little pieces of state locally. This aspect of <strong>React Context API</strong> is probably its best: where Redux might be overkill, React Contexts are a low-key, flexible alternative that's particularly well-suited to big state in small spaces, like this tutorial's walkthrough refactoring of an imperatively-coded guessing game to a React webapp managed with React's Context API.
