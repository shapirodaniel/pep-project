import React from 'react';

const RemainingGuesses = ({ remainingGuesses }) => {
	return (
		<div className='remaining-guesses'>
			Remaining Guesses: {remainingGuesses}
		</div>
	);
};

export default RemainingGuesses;
