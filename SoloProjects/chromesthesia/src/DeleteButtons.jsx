import React, { Component} from 'react';
import "./App.css";

// Simple component that fires off functions to
// do db destruction or remove playlist generated from spotify
function DeleteButtons (props) {
    return(
        <div id="deleteButtonsWrapper">
            <div id="deleteButton1">
                <button type='submit' className="clientButton" onClick={props.destroyDb}>REMOVE ALL TRACKS</button>
            </div>
            <div id="deleteButton2">
                <button type='submit' className="clientButton" onClick={props.destroySong}>REMOVE CURRENT TRACK</button>
            </div>
            <div id="deleteButton3">
                <button type='submit' className="clientButton" onClick={props.destroyPlaylist}>REMOVE PLAYLIST</button>
            </div>
        </div>
    );
}
    
export default DeleteButtons;