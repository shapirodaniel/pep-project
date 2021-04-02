import React from 'react';
import RemainingGuesses from './RemainingGuesses';
import Winstreak from './Winstreak';

const Stats = ({ remainingGuesses, winstreak }) => {
	return (
		<div className='stats'>
			<RemainingGuesses />
			<Winstreak />
		</div>
	);
};

export default Stats;
