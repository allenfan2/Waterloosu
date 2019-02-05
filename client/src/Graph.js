import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export default function Graph(props) {
    const modified = props.data.map(d=>{
        d.date=d.date.split("T")[0]
        return d
    })
    return (
        <div className="Graph">
            <LineChart width={750} height={200} data={modified} 
             margin={{top: 5, right: 5, left: 5, bottom: 5}}>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid stroke="#909090" fill='white' strokeDasharray="10 5"/>
                <Tooltip />
                <Line type="monotone" dataKey="pp_rank" stroke="#8884d8" />
            </LineChart>
        </div>
    )
}
