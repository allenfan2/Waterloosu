import React,{Component} from 'react'
import Events from './Events.js'
import Graph from './Graph'

export default class PlayerCard extends Component {
  constructor(){
    super()
    this.state ={
    }
  }

  cleanText=(event)=> {
    let ctext = event.replace(/<\/?[^>]+(>|$)/g, "");
    ctext = ctext.split(" ").slice(2).join(" ")
    return ctext
  }

  render() {
    const filter = this.props.info.events.map(e => {
      return this.cleanText(e.display_html)
    })
    return (
      <div className="container">
      <div className="topRow">
        <div className="pCard">
          <div className="profpicCont">
            <img src={"https://a.ppy.sh/" + this.props.info.id} alt="avatar load fail" />
            <div className="topleft">{this.props.pos}</div>
          </div>
          <div className="Stats" >
            <h3>{this.props.info.username}</h3>
            <p>PP: {this.props.info.pp_raw}</p>
            <p>Global Rank: {this.props.info.pp_rank}</p>
            <p>Joined: {new Date(this.props.info.join_date).toLocaleDateString()}</p>
          </div>
          <div className="Activity">
            <Events events={filter}></Events>
          </div>
        </div>
        <input className="toggle"
            type="image" alt="toggleButton"
            src={this.props.collapsed ? "/assets/up.png" : "/assets/down.png"}
            onClick={() => this.props.getHistData(this.props.info.id)}
          />
      </div>
        {this.props.collapsed &&  <Graph data={this.props.data}/>}
    </div>
    )
  }
}
