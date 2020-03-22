import React, {Component } from 'react';

import './Controls.css';


export default class Controls extends Component {
    render() {
        return (
            <div className="control_div">
                <button className="control_buttons" id="play" onClick={this.props.startTimer} ></button>
                <button className="control_buttons" id="pause" onClick={this.props.pauseTimer}></button>
                <button className="control_buttons" id="reset" onClick={this.props.resetTimer}></button>    
            </div>
        )
    }
}


