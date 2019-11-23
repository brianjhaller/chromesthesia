
import React, { Component} from "react";
import queryString from 'query-string';
import SpotifyOauth from './SpotifyOauth.jsx';
import ColorButtons from "./ColorButtons.jsx";
import ControlButtons from "./ControlButtons.jsx";
import SongDisplay from "./SongDisplay.jsx";
import BuildPlaylist from "./BuildPlaylist.jsx";
import DeleteButtons from "./DeleteButtons.jsx";

import Title from "./Title.jsx";

import "./App.css";

class App extends Component{
    constructor (props) {
        super(props);
        this.state = {
            track: "None currently playing",
            artist: null,
            album: null,
            user: {name: null, email: null, id: null},
            currentlyPlaying: false,
            trackUri: null,
            trackLength: null,
            playMode: false,
            playlistId: null,
            playlistUri: null,
        }
        // list of bound functions
        this.sendInfo = this.sendInfo.bind(this);
        this.getSong = this.getSong.bind(this);
        this.pausePlay = this.pausePlay.bind(this);
        this.resumePlay = this.resumePlay.bind(this);
        this.skipTrack = this.skipTrack.bind(this);
        this.buildPlaylist = this.buildPlaylist.bind(this);
        this.switchModes = this.switchModes.bind(this);
        this.pullFromDb = this.pullFromDb.bind(this);
        this.addPlaylistSongs = this.addPlaylistSongs.bind(this);
        this.startPlaylist = this.startPlaylist.bind(this);
        this.destroyDb = this.destroyDb.bind(this);
        this.destroySong = this.destroySong.bind(this);
        this.destroyPlaylist = this.destroyPlaylist.bind(this);
    }
    
    // when page loads after authentication, grab user and details 
    componentDidMount() {
        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;
        if (!accessToken)
        return;
        fetch('https://api.spotify.com/v1/me', {
            headers: {'Authorization': 'Bearer ' + accessToken}
        }).then(response => response.json())
        .then(data => this.setState({
            user: {
                name: data.display_name,
                email: data.email,
                id: data.id
            }
        }));
    }

    // query spotify api about what the signed in user is currently playing
    getSong() {
        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;
        if (!accessToken)
          return;
        fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {'Authorization': 'Bearer ' + accessToken}
        }).then(response => response.json())
        .then(data => this.setState({
          track: data.item.name,
          album: data.item.album.name,
          artist: data.item.artists[0].name,
          currentlyPlaying: data.is_playing,
          trackUri: data.item.uri,
          trackLength: data.item.duration_ms,
        }));
    }

    // swich between play mode (generate playlist) and save mode (save songs playing to db)
    switchModes() {
        let update = this.state.playMode ? false : true;
        this.setState({playMode: update})
    }

    // generates an array of uris based on a min/max RGB computation and the spotify ID
    pullFromDb(colorObj) {
        let passedObj = Object.assign(colorObj, { spotifyId: this.state.user.id })
        fetch('/pull-data', {
            headers: { "Content-Type": "application/json" },
            method: 'post',
            body: JSON.stringify(passedObj)
        }).then(res => res.json())
        .then(res => this.buildPlaylist(res));
    }

    // builds an empty playlist into the current user's spotify account
    buildPlaylist (playlistUris) {
        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;
        if (!accessToken)
          return;
        fetch('https://api.spotify.com/v1/me/playlists', {
            headers: {"Accept": "application/json", "Content-Type": "application/json", 'Authorization': 'Bearer ' + accessToken},
            method: 'post',
            body: JSON.stringify({
                "name": "chromesthesia playlist",
                "description": "autogenerated private playlist by running the chromesthesia app",
                "public": false
            })
        }).then(res => res.json())
        .then(res => this.setState({playlistId: res.id, playlistUri: res.uri}))
        .then(res => this.addPlaylistSongs(playlistUris));
    }

    // takes a list of spotify song uris and adds to empty playlist
    addPlaylistSongs(playlistUris) {
        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;
        if (!accessToken)
          return;
        fetch(`https://api.spotify.com/v1/playlists/${this.state.playlistId}/tracks`, {
            headers: {"Accept": "application/json", "Content-Type": "application/json", 'Authorization': 'Bearer ' + accessToken},
            method: 'post',
            body: JSON.stringify({uris: playlistUris})
        })
        .then(this.startPlaylist);
    }

    // starts playing the newly constructed playlist
    startPlaylist() {
        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;
        if (!accessToken)
          return;
        fetch('https://api.spotify.com/v1/me/player/play', {
            headers: {'Authorization': 'Bearer ' + accessToken, "Accept": "application/json", "Content-Type": "application/json"},
            method: 'put',
            body: JSON.stringify({
                "context_uri": this.state.playlistUri
            }),
        }).then(setTimeout(this.getSong, 1000))
        fetch('https://api.spotify.com/v1/me/player/shuffle?state=true', {
            headers: {'Authorization': 'Bearer ' + accessToken},
            method: 'put',
        })
    }

    // removes all songs from the current user's database
    destroyDb() {
        fetch('/destroy-data', {
            headers: { "Content-Type": "application/json" },
            method: 'post',
            body: JSON.stringify({ spotifyId: this.state.user.id })
        }).then(res => res.json())
        .then(res => console.log("successfully destroyed", res))
    }

    // removes only the currently playing song from the current user's database
    destroySong() {
        fetch('/destroy-song', {
            headers: { "Content-Type": "application/json" },
            method: 'post',
            body: JSON.stringify({ trackUri: this.state.trackUri })
        }).then(res => res.json())
        .then(res => console.log("successfully destroyed", res));
    }

    // removes the generated playlist from spotify
    // will not destroy user playlists
    destroyPlaylist() {
        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;
        if (!accessToken)
          return;
        fetch(`https://api.spotify.com/v1/playlists/${this.state.playlistId}/followers`, {
            headers: {"Accept": "application/json", "Content-Type": "application/json", 'Authorization': 'Bearer ' + accessToken},
            method: 'delete',
            body: JSON.stringify({ tracks: [this.state.trackUri] })
        });
    }

    // saves a song, user info, and RGB values into database
    sendInfo(colorArray, trackName, artist, album, trackUri) {
        fetch('/save-color', {
            headers: { "Content-Type": "application/json" },
            method: 'post',
            body: JSON.stringify({red: colorArray[0], green: colorArray[1], blue: colorArray[2], track: trackName, 
                artist: artist, album: album, trackUri: trackUri, spotifyId: this.state.user.id})
        }).then(res => res.json())
        .then(res => console.log(res));
    }

    // pauses current playback
    pausePlay() {
        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;
        if (!accessToken)
          return;
        fetch('https://api.spotify.com/v1/me/player/pause', {
            headers: {'Authorization': 'Bearer ' + accessToken},
            method: 'put',
        }).then(this.getSong)
    }

    // resumes current playback
    resumePlay() {
        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;
        if (!accessToken)
          return;
        fetch('https://api.spotify.com/v1/me/player/play', {
            headers: {'Authorization': 'Bearer ' + accessToken, "Accept": "application/json", "Content-Type": "application/json"},
            method: 'put',
        }).then(this.getSong);
    }
    
    // skips current track
    skipTrack() {
        let parsed = queryString.parse(window.location.search);
        let accessToken = parsed.access_token;
        if (!accessToken)
          return;
        fetch('https://api.spotify.com/v1/me/player/next', {
            headers: {'Authorization': 'Bearer ' + accessToken},
            method: 'post',
        }).then(this.getSong);
    }

    render(){    
        return(
            <div className="App">
                <Title />
                <SpotifyOauth name={this.state.user.name} />
                <ColorButtons 
                    sendInfo={this.sendInfo} pullFromDb={this.pullFromDb} 
                    track={this.state.track} artist={this.state.artist} 
                    album={this.state.album} trackUri={this.state.trackUri} 
                    mode={this.state.playMode} returnSlideValue={this.returnSlideValue} 
                    pullFromDb={this.pullFromDb} />
                <ControlButtons 
                    getSong={this.getSong} pausePlay={this.pausePlay} 
                    resumePlay={this.resumePlay} skipTrack={this.skipTrack} />
                <SongDisplay 
                    track={this.state.track} artist={this.state.artist} 
                    getSong={this.getSong} album={this.state.album} 
                    currentlyPlaying={this.state.currentlyPlaying} />
                <BuildPlaylist 
                    switchModes={this.switchModes} mode={this.state.playMode} />
                <DeleteButtons 
                    destroyDb={this.destroyDb} destroySong={this.destroySong} 
                    destroyPlaylist={this.destroyPlaylist} />
            </div>
        )
    }
}

export default App;