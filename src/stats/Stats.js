import React from 'react';
import { RemainingGuesses, Winstreak } from './';

const Stats = () => {
	return (
		<div className='stats'>
			<RemainingGuesses />
			<Winstreak />
		</div>
	);
};

export default Stats;
