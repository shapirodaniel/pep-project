import React from 'react';

const UserGuess = ({ userGuess }) => {
	return (
		<div className='guess-wrapper'>
			<label htmlFor='user-guess'>Your Guess:</label>
			<div className='user-guess'>{userGuess}</div>
		</div>
	);
};

export default UserGuess;
