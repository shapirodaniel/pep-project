import React, { useContext } from 'react';
import { GameContext } from './context/game';

const UserGuess = () => {
	const { selectedSquare } = useContext(GameContext);

	return (
		<div className='guess-wrapper'>
			<label htmlFor='user-guess'>Your Guess:</label>
			<div className='user-guess'>
				{!selectedSquare ? '' : selectedSquare}
			</div>
		</div>
	);
};

export default UserGuess;
