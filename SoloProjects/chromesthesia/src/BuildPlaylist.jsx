import React, { Component} from 'react';
import "./App.css";


function BuildPlaylist (props) {
    let text;
    if(props.mode === true) text = "SWITCH TO SAVE MODE";
    else text = "SWITCH TO PLAY MODE";
    return(
        <div id="buildPlaylist">
            <button type='submit' className="clientButton" onClick={props.switchModes}>{text}</button>
        </div>
    );
}
  
export default BuildPlaylist;