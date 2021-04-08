import React, { useContext } from 'react';
import { GameContext } from './context/game';

const Winstreak = () => {
	const { state } = useContext(GameContext);

	return (
		<div className='winstreak'>
			Current Win Streak: {state.currentWinstreak}
		</div>
	);
};

export default Winstreak;
