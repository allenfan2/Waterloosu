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
      sortedBy: "recent",
      isReversed: false,
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
        this.setState({ pdata: res.data.sort((a,b)=>{return a.pp_rank-b.pp_rank}) })
        this.getActivity()
      });
  };

  handleClick = (e) => {
    const { value } = e.target
    if (value === this.state.sortedBy) {
      this.setState(prevState =>{
        return{isReversed: !prevState.isReversed}
      })
    } else {
      this.setState({
        sortedBy: value, isReversed: false
      })
    }
  }

  sortPList = (list) => {
    const value = this.state.sortedBy
    switch (value) {
      case "recent":
        return list.sort((a, b) => { return b.events.length - a.events.length })
      case "rank":
        return list.sort((a, b) => { return a.pp_rank - b.pp_rank })
      case "join_date":
        return list.sort((a, b) => { return new Date(a.join_date) - new Date(b.join_date) })
      default:
        console.log("test")
    }
  }




  render() {
    const sortedList = this.sortPList(this.state.pdata)
    const revereseList = this.state.isReversed? sortedList.reverse():sortedList;
    let i = 0
    const PlayerDisplay = revereseList.map(p=>{
      i += 1
      return <PlayerCard getHistData={this.getHistData}
      key={i} info={p} pos={i}
      collapsed={this.state.collapsedpid === p.id ? true:false}
      data={this.state.collapsedpid === p.id ? this.state.histData : null }
      />
    })
    return (
      <div className="App">
        <h1>Waterloosu</h1>
        <div className="PDisplay">
          <div className="SortPlayer">
            <label>{this.state.isReversed ? "⯅" : "⯆"} Sort By: </label>
            <button value="recent" onClick={this.handleClick}
              style={this.state.sortedBy === "recent" ? { fontWeight: 'bolder' } : {}}>
              Recently Active</button>
            <button value="rank" onClick={this.handleClick}
              style={this.state.sortedBy === "rank" ? { fontWeight: 'bolder' } : {}}>
              PP/Rank</button>
            <button value="join_date" onClick={this.handleClick}
              style={this.state.sortedBy === "join_date" ? { fontWeight: 'bolder' } : {}}>
              Join Date</button>
          </div>
          <div className="PInfo">
            {PlayerDisplay}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
