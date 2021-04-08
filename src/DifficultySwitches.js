import React, { useContext } from 'react';
import { GameContext } from './context/game';

const DifficultySwitch = ({ level }) => {
	const { state, dispatch, START_GAME } = useContext(GameContext);

	return (
		<div
			className='difficulty-switch-box'
			onClick={() =>
				dispatch({
					type: START_GAME,
					payload: { difficulty: level },
				})
			}
		>
			<div
				className={
					state.difficulty === level ? 'checkbox active' : 'checkbox'
				}
			>
				<div className='checkmark'></div>
			</div>
			<div className='level-identifier'>{level.toLowerCase()}</div>
		</div>
	);
};

const DifficultySwitches = () => {
	const { difficultiesLib } = useContext(GameContext);

	const levels = Object.keys(difficultiesLib);

	return levels.map(level => <DifficultySwitch key={level} level={level} />);
};

export default DifficultySwitches;
