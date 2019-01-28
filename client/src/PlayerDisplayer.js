import React, { Component } from 'react'
import PlayerCard from './PlayerCard'

export default class PlayerDisplayer extends Component {
  constructor(){
    
  }
  render() {
    const Parray = this.props.pdata.map(p =>
      <PlayerCard {...p} key={p.id} />)
    return (
      <div className="pDisplay">
        {Parray}
      </div>
    )
  }
}
