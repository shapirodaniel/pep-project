import React from 'react';
import UserGuess from './UserGuess';
import PlayerMessage from './PlayerMessage';

const PlayerInfoWrapper = () => {
	return (
		<div className='player-info-wrapper'>
			<UserGuess />
			<PlayerMessage />
		</div>
	);
};

export default PlayerInfoWrapper;
