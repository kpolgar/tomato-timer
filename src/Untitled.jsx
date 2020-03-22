import React, {Component } from 'react';
import './App.css';
import Setter from './components/Setter/Setter';
import Timer from './components/Timer/Timer';
import Controls from './components/Controls/Controls';
import Sound from './components/Sound/Sound';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        breakCount: 5,
        sessionCount: 25,
        sound: true, //sound is turned on or off
        cycle: 'Session',//are we in a break or session
        running: false, //if timer is running
        paused: false,//if paused is clicked
        currentTime: '25:00'
    }

    this.startTime = null; //what time was stopwatch started
    this.updatedTime= null; //time right now
    this.tInterval = 0; //How often we will check the difference between now and our start time
    this.savedTime = 0; //if user presses pause keep track of how long
    this.difference = 0; //the difference in current time and start time + saved time;
}
    
    //Start the stopwatch
    startTimer = () => {
      if (!this.state.running) { //if the stopwatch is not already running
        this.startTime = new Date().getTime(); //getting time when stopwatch is started
        //We are going to check the time every second
        this.tInterval = setInterval(this.getShowTime, 1000); //setting interval
        this.setState({
          running: true,
        });
      }
    }
    //This is the timer function
    getShowTime = () => {
      this.updatedTime = new Date().getTime();
      //if we hit the pause button, the elapsed time needs to be corrected and we must add the time spent waiting
      if (this.savedTime) {
        if (this.state.cycle === 'Session') { //checking for if we are in break or session
          this.difference = (this.state.sessionCount * 60000) - ((this.updatedTime - this.startTime) + this.savedTime);
        }
        if (this.state.cycle === 'Break') { //check for if we are in break or session
          this.difference = (this.state.breakCount * 60000) - (this.updatedTime - this.startTime) + this.savedTime;
        }
      } else { //if pause button was not used
        if (this.state.cycle === 'Session') { //checking for if we are in break or session
          this.difference = (this.state.sessionCount * 60000) - (this.updatedTime - this.startTime);
        }
        if (this.state.cycle === 'Break') { //check for if we are in break or session
          this.difference = (this.state.breakCount * 60000) - (this.updatedTime - this.startTime);
        }
      }

      var minutes = Math.floor((this.difference % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((this.difference % (1000 * 60)) / 1000);
      this.minutes = (minutes < 10) ? "0" + minutes : minutes;
      this.seconds = (seconds < 10) ? "0" + seconds : seconds;
      if (this.seconds >= 0) {
        this.setState({
          currentTime: `${this.minutes} : ${this.seconds}`
        });
      } else {
        clearInterval(this.tInterval); //we clear the interval when the timer reaches 0
        if (this.state.cycle === 'Session') { //we toggle the session to break
          if (this.state.breakCount < 10) { //adding some formatting for single digits
            this.setState({
              cycle: 'Break',
              currentTime: `0${this.state.breakCount} : 00`
            })
          } else { 
            this.setState({ 
              cycle: 'Break',
              currentTime: `${this.state.breakCount} : 00`
            })
          }
        }
        else { //if we are in a break, we toggle to a session
          if (this.state.sessionCount < 10) { //adding some formatting for single digits
            this.setState({
              cycle: 'Session',
              currentTime: `0${this.state.sessionCount} : 00`
            })
          } else { 
            this.setState({ 
              cycle: 'Session',
              currentTime: `${this.state.sessionCount} : 00`
            })
          }
        }
        this.startTime = new Date().getTime(); //getting new start time
        this.tInterval = setInterval(this.getShowTime, 1000); //starting the timer for the next session
      }
    }

    //reset function
    resetTimer = () => {
      if (this.state.running) { //if the stopwatch is not already running
        clearInterval(this.tInterval);
        this.setState({
          breakCount: 5,
          sessionCount: 25,
          sound: true, //sound is turned on or off
          cycle: 'Session',//are we in a break or session
          running: false, //if timer is running
          paused: false,//if paused is clicked
          currentTime: '25:00'
        });
      }
    }

    pauseTimer = () => {
      console.log(this.state.paused)
      
      if (!this.difference){
        //if the timer is never started we do nothing
      }
      else if (!this.state.paused) { //if the stopwatch is not already running
        clearInterval(this.tInterval);
        console.log(this.state.paused, 'second pause')
        this.savedTime = this.difference;
        this.setState({
          running: false,
          paused: true,//if paused is clicked
        });
      }
      else {
        this.startTimer();
      }
    }

    //allows user to turn sound on or off
    toggleSound = () => {
      this.setState({
        sound: !this.state.sound
      })
    }

    //I think this will play the sound
    // setSound = (sound) => {
    //   this.setState({
    //     sound: sound
    //   })
    // };

    bIncrement = ()  => {
        if (this.state.breakCount < 60 && !this.state.running) {
          this.setState({
                breakCount: this.state.breakCount + 1,
              });
        }
        
      };
      
    bDecrement = () => {
        if (this.state.breakCount > 1 && !this.state.running) {
            this.setState({
                breakCount: this.state.breakCount - 1,
            });
        }
      };
    
    //allows user to increment the session length
    sIncrement = () => {
        if (this.state.sessionCount < 60 && !this.state.running) {
          if (this.state.sessionCount < 10) { //adding some formatting for single digits
            this.setState({
              sessionCount: this.state.sessionCount + 1,
              currentTime: `0${this.state.sessionCount+1} : 00`
            })
          } else { 
            this.setState({ 
              sessionCount: this.state.sessionCount + 1,
              currentTime: `${this.state.sessionCount+1} : 00`
            })
          }
        }  
    };
    
    //allows user to decrement the session length
    sDecrement = () => {
        if (this.state.sessionCount > 1 && !this.state.running) {
          if (this.state.sessionCount < 10) { //adding some formatting for single digits
            this.setState({
              sessionCount: this.state.sessionCount - 1,
              currentTime: `0${this.state.sessionCount-1} : 00`
            })
          } else { 
            this.setState({ 
              sessionCount: this.state.sessionCount - 1,
              currentTime: `${this.state.sessionCount-1} : 00`
            })
          }
        }   
        
    };

    // countDown = () => {
    //   // if (this.state.sessionCount !== 0) {
    //   //   startTime = new Date().getTime();
    //   //   tInterval = setInterval(getShowTime, 1);
    //   // }
    // }
  render() {
    return (
      <div className="container_div">
        <h1>Pomodoro Clock</h1>
        <Setter 
          breakCount={this.state.breakCount}
          sessionCount={this.state.sessionCount}
          bIncrement={this.bIncrement}
          bDecrement={this.bDecrement}
          sIncrement={this.sIncrement}
          sDecrement={this.sDecrement}
        />
        <Timer 
          breakCount={this.state.breakCount}
          sessionCount={this.state.sessionCount}
          currentTime={this.state.currentTime}
          cycle={this.state.cycle}
        />
        <Controls 
          startTimer={this.startTimer}
          resetTimer={this.resetTimer}
          pauseTimer={this.pauseTimer}
        />
        <Sound 
          sound={this.state.sound}
          toggleSound={this.toggleSound}
        />
      </div>
    )
  }
}
