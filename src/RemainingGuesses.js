import React, { useContext } from 'react';
import { GameContext } from './context/game';

const RemainingGuesses = () => {
	const { state } = useContext(GameContext);

	return (
		<div className='remaining-guesses'>
			Remaining Guesses: {state.maxGuesses - state.pastGuesses.length}
		</div>
	);
};

export default RemainingGuesses;
