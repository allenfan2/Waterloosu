import React from 'react'

export default function PlayerCard(props) {
  return (
    <div className="pCard">{props.pname + " " + props.country + " " + props.joindate + " "}
    </div>
  )
}
