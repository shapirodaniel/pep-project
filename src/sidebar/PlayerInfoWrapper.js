import React from 'react';
import { UserGuess, PlayerMessage } from './';

const PlayerInfoWrapper = () => {
	return (
		<div className='player-info-wrapper'>
			<UserGuess />
			<PlayerMessage />
		</div>
	);
};

export default PlayerInfoWrapper;
