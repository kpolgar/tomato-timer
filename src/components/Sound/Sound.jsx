import React, {Component } from 'react';
import './Sound.css';



export default class Controls extends Component {
    render() {
        let soundButton;
        if(this.props.sound)  {
            soundButton = <button className="control_buttons" id="sound" onClick={this.props.toggleSound}></button>
        } else {
            soundButton = <button className="control_buttons" id="no_sound" onClick={this.props.toggleSound}></button>
        }
        return (
            
            <div className="sound_div">
                {soundButton}
            </div>
        )
    }
}


//<button id="down" onClick={this.props.bDecrement}></button> 