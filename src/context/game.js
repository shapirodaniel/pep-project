import React, { useState } from 'react';

const GameContext = React.createContext();

const GameProvider = ({ children }) => {
	const difficulties = {
		EASY: 'easy',
		MEDIUM: 'medium',
		HARD: 'hard',
		EXPERT: 'expert',
		JEDI: 'jedi',
	};

	const hints = {
		EASY: 5,
		MEDIUM: 10,
		HARD: 15,
		EXPERT: 20,
		JEDI: 0,
	};

	const guesses = {
		EASY: 5,
		MEDIUM: 4,
		HARD: 3,
		EXPERT: 2,
		JEDI: 1,
	};

	const [winningNumber, setWinningNumber] = useState(0);
	const [selectedSquare, setSelectedSquare] = useState(0);
	const [currentDifficulty, setCurrentDifficulty] = useState(
		difficulties.EASY
	);
	const [maxGuesses, setMaxGuesses] = useState(() => currentDifficulty);
	const [numHints, setNumHints] = useState(() => currentDifficulty);
	const [pastGuesses, setPastGuesses] = useState([]);

	const getWinningNumber = () =>
		setWinningNumber(Math.ceil(Math.random() * 100));

	const getNumHints = () => setNumHints(() => hints[currentDifficulty]);

	const getMaxGuesses = () => setMaxGuesses(() => guesses[currentDifficulty]);

	const providerValue = {
		winningNumber,
		setWinningNumber,
		selectedSquare,
		setSelectedSquare,
		currentDifficulty,
		setCurrentDifficulty,
		maxGuesses,
		setMaxGuesses,
		numHints,
		setNumHints,
		pastGuesses,
		setPastGuesses,
		difficulties,
		getWinningNumber,
		getNumHints,
		getMaxGuesses,
	};

	return (
		<GameContext.Provider value={providerValue}>
			{children}
		</GameContext.Provider>
	);
};

export default GameProvider;