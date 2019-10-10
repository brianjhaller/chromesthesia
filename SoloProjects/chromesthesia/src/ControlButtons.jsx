import React, { Component} from 'react';
import pause from "../dist/pictures/pause.png";
import play from "../dist/pictures/play.png";
import skipNext from "../dist/pictures/skip_next.png";
import "./App.css";

// Creates 3 buttons for Spotify remote control
// play, pause, and skip to next
function ControlButtons (props) {
    return(
        <div>
            <div id="controlPanel">
                <button type='submit' className="clientButton" onClick={props.pausePlay}><img src={pause}></img></button>
                <button type='submit' className="clientButton" onClick={props.resumePlay}><img src={play}></img></button>
                <button type='submit' className="clientButton" onClick={props.skipTrack}><img src={skipNext}></img></button>
            </div>
        </div>
    );
}
  
export default ControlButtons;