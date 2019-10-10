
import React, { Component} from "react";
import DivBox from "./DivBox";
import "./App.css";

class App extends Component{
  render(){
    let colorArray = [];
    for (let i = 0; i < 60; i++) {
      colorArray.push(<DivBox style={{backgroundColor: "red"}} />)
    }
    return(
      <div className="App">
        {colorArray}
      </div>
    );
  }
}

export default App;