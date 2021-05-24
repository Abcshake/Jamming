import React from 'react';
import './Track.css';
import ReactAudioPlayer from 'react-audio-player';
class Track extends React.Component {
    constructor(props){
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }
    addTrack(event){
        this.props.onAdd(this.props.track);
    }
    removeTrack(event){
        this.props.onRemove(this.props.track);
    }
    renderAction(){
        const isRemoval = this.props.isRemoval;
        if(isRemoval) {
            return <button className="Track-action" onClick={this.removeTrack}>-</button>
        } 
            return <button className="Track-action" font-size="16px" onClick={this.addTrack}>+</button>
    }
    render() {
        const hasPreview = this.props.track.preview;
        let audioPlayer;
        if(hasPreview === null){
            audioPlayer = <p>This track has no preview</p>
        } else {
            audioPlayer = <ReactAudioPlayer 
                    src={this.props.track.preview}
                    controls = 'true' 
                />
        }
        return (
        <div className="Track">
            <div className="Track-information">
                <h3>{this.props.track.name}</h3>
                <p>{this.props.track.artist} | {this.props.track.album}</p>
                {audioPlayer}
                <img src={this.props.track.image} alt="album image"></img>
                
            </div>
            <div className="Track-action">
             {this.renderAction()}
            </div>
        </div>
        );
    }
}

export default Track;