import React from 'react';

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

const DifficultySwitches = ({ levels }) => {
	return levels.map(({ id, level }) => (
		<DifficultySwitch key={id} level={level} />
	));
};

export default DifficultySwitches;
