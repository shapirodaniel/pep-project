import React, { useContext } from 'react';
import { GameContext } from './context/game';

const PlayerMessage = () => {
	const { state } = useContext(GameContext);

	return <div className='player-message'>{state.playerMessage || ''}</div>;
};

export default PlayerMessage;
