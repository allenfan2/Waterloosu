import React, { Component } from "react";
import PlayerDisplayer from './PlayerDisplayer'

class App extends Component {
  // initialize our state 
  state = {
    pdata: [],
    dailyStats:[],
    message: null,
    intervalIsSet: false,
  };


  componentDidMount() {
    this.getPlayers();
    this.getTodayStats();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getPlayers, 60000);
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
    fetch("http://localhost:3001/api/getPlayers")
      .then(data => data.json())
      .then(res => this.setState({ pdata: res.data }));
  };

  getTodayStats = () => {
    fetch("http://localhost:3001/api/getlatestInfo")
      .then(data => data.json())
      .then(res => this.setState({ dailyStats: res.data }));
  };
  


  render() {
    const { data } = this.state;
    return (
      <div>
        <h1>Waterloosu</h1>
        <PlayerDisplayer pdata = {this.state.pdata} />
      </div>
    );
  }
}

export default App;
