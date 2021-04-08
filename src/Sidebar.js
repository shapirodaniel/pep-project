import React from 'react';
import PlayerInfoWrapper from './PlayerInfoWrapper';
import PlayerButtons from './PlayerButtons';
import DifficultySwitches from './DifficultySwitches';

const Sidebar = () => {
	return (
		<div className='sidebar'>
			<div className='sidebar-field-wrapper'>
				<PlayerInfoWrapper />
				<PlayerButtons />
			</div>
			<div className='difficulty-wrapper'>
				<DifficultySwitches />
			</div>
		</div>
	);
};

export default Sidebar;
