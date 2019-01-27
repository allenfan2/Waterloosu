import React from 'react'
import PlayerCard from './PlayerCard'

export default function PlayerDisplayer(props) {
  const Parray = props.pdata.map(p =><PlayerCard key={p.id} pname={p.username} joindate={p.join_date} country={p.country} />)
  return (
    <div>
    {Parray}
    </div>
  )
}
