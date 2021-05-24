import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';
import BeatLoader from "react-spinners/BeatLoader";
class SearchResults extends React.Component {

    render () {
        const loading = this.props.isLoading;
      //<TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} />
        
        return (
        <div className="SearchResults">
            <h2>Results</h2> 
            {
                loading ?
                <BeatLoader color={'#6c41ec'} loading={loading} size={150} />
                :
                <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} />
            }
        </div>  
        );  
        }
    }
export default SearchResults;