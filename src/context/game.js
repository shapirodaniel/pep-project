/* eslint-disable default-case */
import React, { useReducer } from 'react';

export const GameContext = React.createContext();

const difficultiesLib = {
	EASY: 'EASY',
	MEDIUM: 'MEDIUM',
	HARD: 'HARD',
	EXPERT: 'EXPERT',
	JEDI: 'JEDI',
};

const hintsLib = {
	EASY: 5,
	MEDIUM: 10,
	HARD: 15,
	EXPERT: 20,
	JEDI: 0,
};

const guessesLib = {
	EASY: 5,
	MEDIUM: 4,
	HARD: 3,
	EXPERT: 2,
	JEDI: 1,
};

const progressesLib = {
	PLAYING: 'PLAYING',
	WON: 'WON',
	LOST: 'LOST',
};

const playerMessagesLib = {
	YOU_WIN: 'You Win!',
	ALREADY_GUESSED: 'You have already guessed that number.',
	YOU_LOSE: 'You Lose :(',
	BURNING_UP: "You're burning up!",
	LUKEWARM: "You're lukewarm.",
	BIT_CHILLY: "You're a bit chilly.",
	ICE_COLD: "You're ice cold!",
	JEDI_HINT: 'Reach out with your feelings ...',
	CLEAR_MESSAGE: '',
	START_MESSAGE: 'Good luck!',
	NOT_ENOUGH_GUESSES_LEFT: 'Not enough guesses left to hint...go for it!',
};

const initState = {
	difficulty: '',
	pastGuesses: [],
	winningNumber: 0,
	currentHints: [],
	maxGuesses: 0,
	numHints: 0,
	selectedSquare: 0,
	currentProgress: progressesLib.PLAYING,
	playerMessage: playerMessagesLib.START_MESSAGE,
};

const START_GAME = 'START_GAME';
const PLAYER_GUESSED = 'PLAYER_GUESSED';
const PLAYER_REQUESTED_HINT = 'PLAYER_REQUESTED_HINT';

const getPlayerMessage = (guess, winner) => {
	if (guess === winner) return playerMessagesLib.YOU_WIN;

	const diff = Math.abs(guess - winner);

	switch (true) {
		case diff < 10:
			return playerMessagesLib.BURNING_UP;
		case diff < 25:
			return playerMessagesLib.LUKEWARM;
		case diff < 50:
			return playerMessagesLib.BIT_CHILLY;
		case diff < 100:
			return playerMessagesLib.ICE_COLD;
	}
};

const reducer = (state = initState, { type, payload }) => {
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
			};
		}

		case PLAYER_GUESSED: {
			// if player has won
			if (payload.selectedSquare === state.winningNumber) {
				return {
					...state,
					currentProgress: progressesLib.WON,
					playerMessage: playerMessagesLib.YOU_WIN,
				};
			}

			// if player has already made that guess
			if (state.pastGuesses.includes(payload.selectedSquare))
				return {
					...state,
					playerMessage: playerMessagesLib.ALREADY_GUESSED,
				};

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
				return {
					...newState,
					currentProgress: progressesLib.LOST,
					playerMessage: playerMessagesLib.YOU_LOSE,
				};
			}

			// otherwise, keep playing
			return {
				...newState,
				playerMessage: playerMessagesLib.CLEAR_MESSAGE,
			};
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
			if (state.maxGuesses - payload.pastGuesses.length === 1) {
				return {
					...state,
					playerMessage: playerMessagesLib.NOT_ENOUGH_GUESSES_LEFT,
				};
			}

			// otherwise, generate new hints
			let newHints = new Array(difficultiesLib[payload.difficulty])
				.fill(null)
				.map(() => Math.ceil(Math.random() * 100));

			// include the winning number if not already present
			if (!newHints.includes(payload.winningNumber))
				newHints[0] = payload.winningNumber;

			return {
				...state,
				currentHints: newHints,
				playerMessage: playerMessagesLib.CLEAR_MESSAGE,
				pastGuesses: [...payload.pastGuesses, null],
			};
		}

		default:
			return state;
	}
};

const GameProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer);

	const providerValue = {
		state,
		dispatch,
		difficultiesLib,
		PLAYER_GUESSED,
		PLAYER_REQUESTED_HINT,
		START_GAME,
	};

	return (
		<GameContext.Provider value={providerValue}>
			{children}
		</GameContext.Provider>
	);
};

export default GameProvider;
