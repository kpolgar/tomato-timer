import React, {Component } from 'react';

import './Setter.css'

export default class Setter extends Component {
  
    

    render() {
        return (
            <div className="setter_div">
                <div className="break_div set_length">
                    <p>Break Length</p>
                    <div>
                        <div className="set">
                            <button id="down" onClick={this.props.bDecrement}></button> 
                        </div>
                        <div className="set number">{this.props.breakCount}</div>
                        <div className="set">
                            <button id="up" onClick={this.props.bIncrement}></button> 
                        </div>
                    </div>
                </div>

                <div className="session_div set_length">
                    <p>Session Length</p>
                    <div>
                        <div className="set">
                            <button id="down" onClick={this.props.sDecrement}></button> 
                        </div>
                        <div className="set number">{this.props.sessionCount}</div>
                        <div className="set">
                            <button id="up" onClick={this.props.sIncrement}></button> 
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}