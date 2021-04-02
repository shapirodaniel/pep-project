import React from 'react';

const UserGuess = ({ userGuess }) => {
	return (
		<div className='guess-wrapper'>
			<label for='user-guess'>Your Guess:</label>
			<div class='user-guess'>{userGuess}</div>
		</div>
	);
};

export default UserGuess;
