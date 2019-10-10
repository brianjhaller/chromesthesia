import React, { Component} from 'react';
import "./App.css";


function SongDisplay (props) {
    let trackText, artistText, albumText, track, artist, album;
    if (props.track !== "none currently playing" && props.currentlyPlaying) {
        trackText = "now playing: "
        track = props.track;
        artistText = "artist: " 
        artist = props.artist;
        albumText = "album: " 
        album = props.album;
    }
    else if (props.track !== "none currently playing" && !props.currentlyPlaying) {
        trackText = "currently paused: ";
        track = props.track;
        artistText = "artist: " 
        artist = props.artist;
        albumText = "album: " 
        album = props.album;
    }
    else track = "none currently playing";
    return(
        <div id="songDisplayWrapper">
            <button type='submit' id="songDisplay" onClick={props.getSong}>
                <div className="trackinfo"><span class='infotext'>{trackText}</span><span class='infoname'>{track}</span></div>
                <div className="trackinfo"><span class='infotext'>{artistText}</span><span class='infoname'>{artist}</span></div>
                <div className="trackinfo"><span class='infotext'>{albumText}</span><span class='infoname'>{album}</span></div>

            </button>
        </div>
    );
}
    
export default SongDisplay;