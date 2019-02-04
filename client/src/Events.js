import React from 'react'

export default function Events(props) {
    const displayEvent = props.events.map(e=>{
        return <li>{e}</li>
    })
    return (
        <div>
            <ul>{props.events.length === 0? <li>No recent activity</li>: displayEvent}</ul>
        </div>
    )
}
