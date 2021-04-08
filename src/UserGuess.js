import React, { useContext } from 'react';
import { GameContext } from './context/game';

const UserGuess = () => {
	const { state } = useContext(GameContext);

	return (
		<div className='guess-wrapper'>
			<label htmlFor='user-guess'>Your Guess:</label>
			<div className='user-guess'>
				{!state.selectedSquare ? '' : state.selectedSquare}
			</div>
		</div>
	);
};

export default UserGuess;
