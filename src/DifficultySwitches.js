import React, { useContext } from 'react';
import { GameContext } from './context/game';

const DifficultySwitch = ({ level, isActive = false }) => {
	return (
		<div className='difficulty-switch-box'>
			<div className={isActive ? 'checkbox active' : 'checkbox'}>
				<div className='checkmark'></div>
			</div>
			<div className='level-identifier'>{level}</div>
		</div>
	);
};

const DifficultySwitches = () => {
	const { difficulties } = useContext(GameContext);

	const levels = Object.keys(difficulties);

	return levels.map(level => <DifficultySwitch key={level} level={level} />);
};

export default DifficultySwitches;
