import './App.css';
import Songs from './Songs';
import PlayList from './Playlist';

function App() {
  return (
    <div className="container">
      <h1>Steeze Music Player</h1>
      <PlayList />
      <Songs />
    </div>
  );
}

export default App;
