import React from 'react';

const PlayerButtons = () => {
	return (
		<div className='button-wrapper'>
			<input type='button' id='submit-guess-btn' value='SUBMIT GUESS' />
			<input type='button' id='hint-btn' value='GET A HINT' />
			<input type='button' id='play-again-btn' value='PLAY AGAIN' />
		</div>
	);
};

export default PlayerButtons;
