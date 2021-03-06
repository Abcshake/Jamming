import React from 'react';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import Spotify from '../../util/Spotify';


class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      searchResults: [],
      playlistTracks: [],
      playlistName: 'New Playlist',
      isLoading: false
  };
  this.addTrack = this.addTrack.bind(this);
  this.removeTrack = this.removeTrack.bind(this);
  this.updatePlaylistName = this.updatePlaylistName.bind(this);
  this.savePlayList = this.savePlayList.bind(this);
  this.search = this.search.bind(this);
  }
  
  addTrack(track){
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)){
      return;
    }
    tracks.push(track);
    this.setState({playlistTracks: tracks});
  }
  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);

    this.setState({playlistTracks: tracks});
  }
  updatePlaylistName(name){
    this.setState({playlistName: name});
  }
  savePlayList(){
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }
  search(term){
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults, isLoading: true});
      setTimeout(() => {
        this.setState({isLoading: false})
      }, 1000);
    })
  }
  componentDidMount() {
    window.addEventListener('load', () => {Spotify.getAccessToken()});
  }
  render() {
  return (
    <div>
     <h1>Spotify Playlist Maker</h1>
     <div className="App">
       <SearchBar onSearch={this.search} />
       <div className="App-playlist">
        <SearchResults searchResults={this.state.searchResults} isLoading = {this.state.isLoading} onAdd={this.addTrack}/>
        <Playlist playlistTracks={this.state.playlistTracks}
                  playlistName={this.state.playlistName}
                  onRemove={this.removeTrack}
                  onNameChange={this.updatePlaylistName}
                  onSave={this.savePlayList} />
       </div>
     </div>  
    </div>
  );
}
}

export default App;
