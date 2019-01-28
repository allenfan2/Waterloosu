import React,{Component} from 'react'

export default class PlayerCard extends Component {
  constructor(){
    super()
    this.state={
      time:null
    }
  }

  render() {
    return (
      <div className="pCard">
        <img className="profpic" src={"https://a.ppy.sh/" + this.props.info.id} alt="avatar load fail" /> 
        <div className="Stats">
        <h1>{this.props.info.username}</h1>
          <p>Country: {this.props.info.country}</p>
          <p>PP: {this.props.info.pp_raw}</p>
          <p>Global Rank: {this.props.info.pp_rank}</p>
        </div>
        <br />
      </div>
    )
  }
}
