import React from 'react';

const Row = ({ scalar }) => {
	const pattern = () => {
		return (scalar / 10) % 2 === 0
			? ['lightSquare', 'darkSquare']
			: ['darkSquare', 'lightSquare'];
	};

	return (
		<div className='row'>
			{new Array(10).fill(null).map((empty, idx) => {
				const [oddSquare, evenSquare] = pattern();

				return (
					<span
						key={idx}
						className={idx % 2 === 0 ? oddSquare : evenSquare}
					>
						{idx + 1 + scalar}
					</span>
				);
			})}
		</div>
	);
};

const PlayingField = () => {
	const scalars = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];

	return (
		<div className='playing-field'>
			{scalars.map(scalar => (
				<Row key={scalar} scalar={scalar} />
			))}
		</div>
	);
};

export default PlayingField;
