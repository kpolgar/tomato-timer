import React, {Component } from 'react';
import logo from '../../logo.png';
import './Timer.css';

export default class Timer extends Component {
    render() {
        return (
            <div className="timer_div">
                <img src={logo} className="tomato-logo" alt="logo" />
                <div id="stopwatch">
                    <h2>{this.props.cycle}</h2>
                    <h1>{this.props.currentTime}</h1>
                </div>
            </div>
        )
    }
}