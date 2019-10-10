import React, { Component} from 'react';
import "./App.css";


function Title(props) {
    let title = [], r, g, b;
    let frequency = 0.4;
    let letters = ["c", "h", "r", "o", "m", "e", "t", "h", "e", "s", "i", "a"];
    for (let i = 0; i < letters.length; i += 1) {
        r = Math.sin(frequency*i + 0) * 127 + 128;
        g = Math.sin(frequency*i + 2) * 127 + 128;
        b = Math.sin(frequency*i + 4) * 127 + 128;
        let rgbString = 'rgb(' + r + ',' + g + ',' + b + ')'
        title.push(<span className='titleletter' style={{color: rgbString}}>{letters[i]}</span>)
    }
    return(
        <div className='titlewrapper'>
            <div className='title'>
                {title}
            </div>
        </div>
    );
}
  
export default Title;