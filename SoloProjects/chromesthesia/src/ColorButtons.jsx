import React, { Component} from 'react';
import "./App.css";

// This class creates the RGB strip that is a series of buttons
class ColorButtons extends Component {
    constructor (props) {
        super(props);
        this.state = {
            opacityChangeArr: [],
            startRGB: null,
            downPress: false
        }
        this.opacityChange = this.opacityChange.bind(this);
        this.storeStart = this.storeStart.bind(this);
        this.storeEnd = this.storeEnd.bind(this);
    }

    // On mouse hover while pressed down, change opacity of buttons
    opacityChange (i) {
        if (this.state.downPress) {
            this.setState({opacityChangeArr: [...this.state.opacityChangeArr, i]});
        }
    }

    // Takes initial click RGB value and turns on the opacity change function
    storeStart(rgbArray, i) {
        this.setState({startRGB: rgbArray, downPress: true, opacityChangeArr: [...this.state.opacityChangeArr, i]});
    }

    // Takes end value of RGB button and creates an object with min and max values for RGB, then fires
    // request to database and resets the state
    storeEnd(rgbArray) {
        console.log(this.state.startRGB, rgbArray);
        let minMaxObj = {};
        let labelArray = [["redMin", "redMax"], ["greenMin", "greenMax"], ["blueMin", "blueMax"]];
        for (let i = 0; i < rgbArray.length; i++) {
            if (rgbArray[i] > this.state.startRGB[i]) {
                minMaxObj[labelArray[i][0]] = this.state.startRGB[i];
                minMaxObj[labelArray[i][1]] = rgbArray[i]
            }
            else {
                minMaxObj[labelArray[i][0]] = rgbArray[i]
                minMaxObj[labelArray[i][1]] = this.state.startRGB[i];
            }
        }
        this.props.pullFromDb(minMaxObj)
        this.setState({downPress: false, opacityChangeArr: []});
    }

    render () {
        // generate the strip of RGB buttons as a color spectrum
        let colorArray = [], r, g, b;
        let frequency = 0.02;
        for (let i = 0; i < 320; i++) {
            let opacityVal = 1;
            if(this.state.opacityChangeArr.includes(i)) opacityVal = 0.5;
            r = Math.sin(frequency*i + 0) * 127 + 128;
            g = Math.sin(frequency*i + 2) * 127 + 128;
            b = Math.sin(frequency*i + 4) * 127 + 128;
            let rgbString = 'rgb(' + r + ',' + g + ',' + b + ')'; 
            let rgbArray = [r, g, b];
            // if in save mode, a click on the button will fire sendInfo which stores this info into the db
            if (!this.props.mode) {
                colorArray.push(<button key={"butkey" + i} className='colorbox' style={{backgroundColor: rgbString }} 
                    onClick={() => this.props.sendInfo(rgbArray, this.props.track, this.props.artist, this.props.album, this.props.trackUri)} />)
            }
            // if in play mode, a mouse down - over - mouse up will find songs stored in that area
            else {
                colorArray.push(<button key={"butkey" + i} id={"button" + i} onMouseDown={() => this.storeStart(rgbArray, i)} onMouseUp={() => this.storeEnd(rgbArray)} onMouseOver={() => this.opacityChange(i)} className='colorbox' style={{backgroundColor: rgbString, opacity: opacityVal}} 
                    onClick={() => this.props.pullFromDb} />)
            }
        }

        return(
            <div id="colorWrapper">
                <div id="colorArray">
                    {colorArray}
                </div>
            </div> 
        );
    }
}
  
export default ColorButtons;