import React, {Component } from 'react';
import './App.css';
import Setter from './components/Setter/Setter';
import Timer from './components/Timer/Timer';
import Controls from './components/Controls/Controls';
import Sound from './components/Sound/Sound';
import soundfile from './assets/BeepSound.wav'

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
        currentTime: '25 : 00',
        startTime: null,
        updatedTime: null, 
        play: false
    }

    this.tInterval = 0; //How often we will check the difference between now and our start time
    this.savedTime = 0; //if user presses pause keep track of how long
    this.difference = 0; //the difference in current time and start time + saved time;
    this.audio = new Audio(soundfile);
}
    
    //Start the stopwatch
    startTimer = () => {
      if (!this.state.running) { //if the stopwatch is not already running
        if (!this.savedTime) {
          this.setState({
            startTime: new Date().getTime() + 1000
          });
        }
        if (this.savedTime) {
          this.setState({
            startTime: new Date().getTime()
          });
        }
        
        //We are going to check the time every second
        console.log('startTime: ', this.state.startTime);
        this.tInterval = setInterval(this.getShowTime, 1000); //setting interval
        this.setState({
          running: true,
          paused: false
        });
      }
    }
    //This is the timer function
    getShowTime = () => {
      this.setState({
        updatedTime: new Date().getTime()
      });
      //this.updatedTime = new Date().getTime() - 1000;
      console.log('updatedTime: ', this.state.updatedTime);
      //if we hit the pause button, the elapsed time needs to be corrected and we must add the time spent waiting
      if (this.savedTime) {
        console.log('hitting saved time in pause')
        if (this.state.cycle === 'Session') { //checking for if we are in break or session
          this.difference = this.savedTime - (this.state.updatedTime - this.state.startTime);
        }
        if (this.state.cycle === 'Break') { //check for if we are in break or session
          this.difference = this.savedTime - (this.state.updatedTime - this.state.startTime);
        }
      } else { //if pause button was not used
        if (this.state.cycle === 'Session') { //checking for if we are in break or session
          this.difference = (this.state.sessionCount * 60000) - (this.state.updatedTime - this.state.startTime);
        }
        if (this.state.cycle === 'Break') { //check for if we are in break or session
          this.difference = (this.state.breakCount * 60000) - (this.state.updatedTime - this.state.startTime);
        }
      }

      var minutes = Math.floor((this.difference % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((this.difference % (1000 * 60)) / 1000);
      this.minutes = (minutes < 10) ? "0" + minutes : minutes;
      this.seconds = (seconds < 10) ? "0" + seconds : seconds;
      console.log(this.seconds)
      if (this.difference <= 1001) {
        console.log('1 second left')
        if (this.state.sound) {
          var playPromise = this.audio.play();

          if (playPromise !== undefined) {
            playPromise
              .then(_ => {
                // Automatic playback started!
                // Show playing UI.
                console.log("audio played auto");
              })
              .catch(error => {
                // Auto-play was prevented
                // Show paused UI.
                console.log("playback prevented");
              });
          }
        } 
      }

      if (this.seconds >= 0) {
        this.setState({
          currentTime: `${this.minutes} : ${this.seconds}`
        });
        console.log('currentTime: ', this.state.currentTime);
      } else {

       

        clearInterval(this.tInterval); //we clear the interval when the timer reaches 0
        this.savedTime = 0;

        
        console.log(this.savedTime)
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
        this.setState({ 
          startTime: new Date().getTime() + 1000
        })
        //this.startTime = new Date().getTime(); //getting new start time
        this.tInterval = setInterval(this.getShowTime, 1000); //starting the timer for the next session
        
      }
    }

    //reset function
    resetTimer = () => {
      if (this.state.running || this.state.paused) { //if the stopwatch is not already running
        clearInterval(this.tInterval);
        this.setState({
          breakCount: 5,
          sessionCount: 25,
          sound: true, //sound is turned on or off
          cycle: 'Session',//are we in a break or session
          running: false, //if timer is running
          paused: false,//if paused is clicked
          currentTime: '25 : 00'
        });
        this.savedTime = 0;
        this.difference = 0;
        this.tInterval = 0;
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
        if (this.state.cycle === "Session") {
          this.savedTime = this.difference;
        }
        if (this.state.cycle === "Break") {
          this.savedTime = this.difference;
        }
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

    play = () => {
      this.setState({ play: true})
      //this.audio.play();

      var playPromise = this.audio.play();
      console.log(playPromise)

      if (playPromise !== undefined) {
        playPromise
          .then(_ => {
            // Automatic playback started!
            // Show playing UI.
            console.log("audio played auto");
          })
          .catch(error => {
            // Auto-play was prevented
            // Show paused UI.
            console.log("playback prevented");
          });
      }



    }

    //I think this will play the sound
    // setSound = (sound) => {
    //   this.setState({
    //     sound: sound
    //   })
    // };

    bIncrement = ()  => {
        if (this.state.breakCount < 60 && !this.state.running && !this.state.paused) {
          this.setState({
                breakCount: this.state.breakCount + 1,
              });
        }
        
      };
      
    bDecrement = () => {
        if (this.state.breakCount > 1 && !this.state.running && !this.state.paused) {
            this.setState({
                breakCount: this.state.breakCount - 1,
            });
        }
      };
    
    //allows user to increment the session length
    sIncrement = () => {
        if (this.state.sessionCount < 60 && !this.state.running && !this.state.paused) {
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
        if (this.state.sessionCount > 1 && !this.state.running && !this.state.paused) {
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