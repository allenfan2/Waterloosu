import React, { Component } from "react";
import PlayerCard from './PlayerCard'

class App extends Component {
  // initialize our state 
  constructor(){
    super()
    this.state = {
    pdata: [],
    message: null,
    intervalIsSet: false,
    }
    this.test = this.test.bind(this)
  }

  componentDidMount() {
    this.getPlayers();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getPlayers, 10000);
      this.setState({ intervalIsSet: interval });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }


  getPlayers = () => {
    fetch("http://localhost:3001/api/getInfo")
      .then(data => data.json())
      .then(res => {
        this.setState({ pdata: res.data })
      });
  };

  test(){
    console.log(this.state.pdata[0])
  }


  render() {
    const PlayerDisplay = this.state.pdata.map(p=>{
      return <PlayerCard info={p}/>
    })
    return (
      <div className ="App">
        <h1>Waterloosu</h1>
        <div className="PDisplay"> 
        {PlayerDisplay}
        </div>
      </div>
    );
  }
}

export default App;
