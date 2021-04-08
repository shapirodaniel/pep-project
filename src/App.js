import './App.css';
import PlayingField from './playing-field/PlayingField';
import { Stats } from './stats';
import { Sidebar } from './sidebar';
import GameProvider from './context/game';

function App() {
	return (
		<GameProvider>
			<div className='App'>
				<div className='wrapper'>
					<div className='main'>
						<h1>
							THE <span className='h1-emphasis'>GUESSING</span>{' '}
							GAME
						</h1>
						<PlayingField />
						<Stats />
					</div>
					<Sidebar />
				</div>
			</div>
		</GameProvider>
	);
}

export default App;
