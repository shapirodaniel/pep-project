import './App.css';
import PlayingField from './PlayingField';
import Stats from './Stats';
import Sidebar from './Sidebar';
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
