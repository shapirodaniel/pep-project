import React, { useContext } from 'react';
import { GameContext } from './context/game';

const PlayerButtons = () => {
	const {
		winningNumber,
		setWinningNumber,
		selectedSquare,
		progresses,
		currentProgress,
		setCurrentProgress,
	} = useContext(GameContext);

	// take in a progress string ('PLAYING', 'WON', 'LOST')
	// set values on GameContext according to progress
	const setGameState = () => {};

	return (
		<div className='button-wrapper'>
			<input
				type='button'
				id='submit-guess-btn'
				value='SUBMIT GUESS'
				onClick={() => {
					// grab useReducer
					// set up a game state reducer based on selection,
					// number of guesses, hints, etc.
					// return a progress string to use here
					setGameState(/* progress string */);
				}}
			/>
			<input type='button' id='hint-btn' value='GET A HINT' />
			<input type='button' id='play-again-btn' value='PLAY AGAIN' />
		</div>
	);
};

export default PlayerButtons;
