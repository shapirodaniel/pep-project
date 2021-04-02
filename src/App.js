import './App.css';
import PlayingField from './PlayingField';
import Stats from './Stats';
import Sidebar from './Sidebar';

function App() {
	return (
		<div className='App'>
			<div className='wrapper'>
				<div className='main'>
					<h1>
						THE <span className='h1-emphasis'>GUESSING</span> GAME
					</h1>
					<PlayingField />
					<Stats />
				</div>
				<Sidebar />
			</div>
		</div>
	);
}

export default App;
