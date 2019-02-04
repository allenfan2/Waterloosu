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
    const ctext = event.replace(/<\/?[^>]+(>|$)/g, "");
    return ctext
  }

  render() {
    const filter = this.props.info.events.map(e=>{
      return this.cleanText(e.display_html)
    })
    return (
      <div className="container">
        <div className="pCard">
          <img className="profpic" src={"https://a.ppy.sh/" + this.props.info.id} alt="avatar load fail" />
          <div className="Stats">
            <h3>{this.props.info.username}</h3>
            <p>PP: {this.props.info.pp_raw}</p>
            <p>Global Rank: {this.props.info.pp_rank}</p>
          </div>
          <div className="Events">
            <h4>Events</h4>
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
        {this.props.collapsed && <Graph data={this.props.data}/>}
      </div>
    )
  }
}
