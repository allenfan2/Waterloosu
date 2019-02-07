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
      let interval = setInterval(this.getPlayers, 900000);
      this.setState({ intervalIsSet: interval });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

   getActivity = async(p) => {
      return fetch("https://osu.ppy.sh/api/get_user?k=259ac227b4133eddbb00cb52e15f47a635684f2e&u="+ p)
      .then(data => data.json())
      .then(data => {return data})
  }

  getHistData=(id)=>{
    if (this.state.collapsedpid === id){
      this.setState({ collapsedpid: -1 })
    }else{
      this.setState({ collapsedpid: id })
    }
    fetch("http://localhost:4000/api/getAllInfo/"+id.toString())
      .then(data => data.json())
      .then(res => {
        this.setState({ histData: res.data })
      });
  }

  getPlayers = () => {
    fetch("http://localhost:4000/api/getInfo")
      .then(data => data.json())
      .then(res => {
        let eventFetch = []
        res.data.forEach(p => {
          eventFetch.push(this.getActivity(p.id))
        })
        Promise.all(eventFetch)
          .then(() => {
            let dataArr = []
            let prom2 = eventFetch.map(async (e) => {
              e.then(e => dataArr.push(e[0]))
            })
            Promise.all(prom2).then(()=>{
              res.data = res.data.sort((a,b)=>{return a.id-b.id})
              dataArr = dataArr.sort((a,b)=>{return a.user_id-b.user_id})
              for (let i=0; i<res.data.length;++i){
                res.data[i].events=dataArr[i].events
              }
              this.setState({ pdata: res.data })
              }
            )
          }
          )
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
    const loadingLabel = <h1>Loading...</h1>
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
            {this.state.pdata.length === 0? loadingLabel : PlayerDisplay}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
