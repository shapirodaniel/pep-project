import React from 'react';
import PlayerInfoWrapper from './PlayerInfoWrapper';
import PlayerButtons from './PlayerButtons';
import DifficultySwitches from './DifficultySwitches';

const levels = [
	{ id: 1, level: 'easy' },
	{ id: 1, level: 'medium' },
	{ id: 1, level: 'hard' },
	{ id: 1, level: 'expert' },
	{ id: 1, level: 'jedi' },
];

const Sidebar = () => {
	return (
		<div className='sidebar'>
			<div className='sidebar-field-wrapper'>
				<PlayerInfoWrapper />
				<PlayerButtons />
			</div>
			<div className='difficulty-wrapper'>
				<DifficultySwitches levels={levels} />
			</div>
		</div>
	);
};

export default Sidebar;
