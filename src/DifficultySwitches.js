import React from 'react';

const DifficultySwitch = ({ level, isActive = false }) => {
	return (
		<div class='difficulty-switch-box'>
			<div class={isActive ? 'checkbox active' : 'checkbox'}>
				<div class='checkmark'></div>
			</div>
			<div class='level-identifier'>{level}</div>
		</div>
	);
};

const DifficultySwitches = ({ levels }) => {
	return levels.map(({ id, level }) => (
		<DifficultySwitch key={id} level={level} />
	));
};

export default DifficultySwitches;
