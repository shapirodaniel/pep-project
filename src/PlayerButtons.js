import React, { useContext } from 'react';
import { GameContext } from './context/game';

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

	console.log(state);

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
				onClick={() => dispatch({ type: PLAYER_REQUESTED_HINT })}
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
