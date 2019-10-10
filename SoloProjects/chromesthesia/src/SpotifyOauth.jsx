import React, { Component} from 'react';
import "./App.css";


function SpotifyOauth(props) {
    let name;
    if (props.name !== null) name = props.name + " is currently logged in.";
    else name = "Not currently logged in."
    return(
        <div>
            <div id="spotifyOauth">
                <form method="POST" action='/login'>
                    <input type='submit' className='clientButton' value="LOG IN TO SPOTIFY" />
                </form>
            </div>
            <div id="loginInfo">
                {name}
            </div>
        </div>
    );
}
  
export default SpotifyOauth;