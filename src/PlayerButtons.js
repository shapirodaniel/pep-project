import React, { useContext } from 'react';
import { GameContext } from './context/game';

const PlayerButtons = () => {
	const {
		winningNumber,
		setWinningNumber,
		selectedSquare,
		progresses,
		currentDifficulty,
		currentProgress,
		setCurrentProgress,
		dispatch,
	} = useContext(GameContext);

	// take in a progress string ('PLAYING', 'WON', 'LOST')
	// set values on GameContext according to progress
	const setGameState = selected => {
		dispatch(selected);
	};

	return (
		<div className='button-wrapper'>
			<input
				type='button'
				id='submit-guess-btn'
				value='SUBMIT GUESS'
				onClick={() => setGameState(selectedSquare)}
			/>
			<input type='button' id='hint-btn' value='GET A HINT' />
			<input type='button' id='play-again-btn' value='PLAY AGAIN' />
		</div>
	);
};

export default PlayerButtons;
