import React, { Component } from "react";
import PlayerCard from './PlayerCard'

class App extends Component {
  // initialize our state 
  constructor(){
    super()
    this.state = {
      pdata: [],
      histData: [],
      collapsedpid: -1, 
      intervalIsSet: false,
    }
  }

  componentDidMount() {
    this.getPlayers();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getPlayers, 600000);
      this.setState({ intervalIsSet: interval });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getActivity =()=>{
      this.state.pdata.forEach(p=>{
        fetch("https://osu.ppy.sh/api/get_user?k=259ac227b4133eddbb00cb52e15f47a635684f2e&u="+p.id)
        .then(data=>data.json())
        .then(res=>{
          for(let i=0; i<this.state.pdata.length ;++i){
            if(this.state.pdata[i].id === p.id){
              let newdata = [...this.state.pdata]
              let player ={...newdata[i]}
              player.events = res[0].events
              newdata[i]=player
              this.setState({pdata:newdata})
            }
          }
        })
      })
  }

  getHistData=(id)=>{
    if (this.state.collapsedpid === id){
      this.setState({ collapsedpid: -1 })
    }else{
      this.setState({ collapsedpid: id })
    }
    fetch("http://localhost:3001/api/getAllInfo/"+id.toString())
      .then(data => data.json())
      .then(res => {
        this.setState({ histData: res.data })
      });
  }

  getPlayers = () => {
    fetch("http://localhost:3001/api/getInfo")
      .then(data => data.json())
      .then(res => {
        this.setState({ pdata: res.data })
        this.getActivity()
      });
  };



  render() {
    const PlayerDisplay = this.state.pdata.map(p=>{
      return <PlayerCard getHistData={this.getHistData} 
      key={p.id} info={p}
      collapsed={this.state.collapsedpid === p.id ? true:false}
      data={this.state.collapsedpid === p.id ? this.state.histData : null }
      />
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
