import './App.css';
import PlayingField from './PlayingField';

function App() {
	return (
		<div className='App'>
			<div className='wrapper'>
				<div className='main'>
					<h1>
						THE <span className='h1-emphasis'>GUESSING</span> GAME
					</h1>
					<PlayingField />
				</div>
			</div>
		</div>
	);
}

export default App;
