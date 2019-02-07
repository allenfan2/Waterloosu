import React, { Component } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default class Graph extends Component {
    constructor(){
        super()
        this.state = {
            graphParam:"pp_rank",
        }
    }

    handleChange =(event)=>{
        const {name, value} = event.target
        this.setState({
            [name]:value
        })
    }


    render() {
        const modified = this.props.data.map(d => {
            d.date = d.date.split("T")[0]
            d.accuracy = parseFloat(Math.round(d.accuracy * 100) / 100).toFixed(2)
            return d
        })
        const accAxis = <YAxis type="number" tick={{ fontSize: 12 }} domain={[dataMin =>(Math.round(dataMin-3)) , 100]} />
        const otherAxis = <YAxis type="number" tick={{ fontSize: 12 }} domain={[dataMin =>(Math.round(dataMin*0.9)) , dataMax =>(Math.round(dataMax*1.1))]} />
        return (
            <div className="Graph">
                <div className="graphSelect">
                    <label>Graph Options:</label>
                    <label>
                        <input
                            type="radio"
                            name="graphParam"
                            value="pp_rank"
                            checked={this.state.graphParam==="pp_rank"}
                            onChange={this.handleChange}
                        />Global Rank
                </label>
                <label>
                    <input
                            type="radio"
                            name="graphParam"
                            value="pp_raw"
                            checked={this.state.graphParam==="pp_raw"}
                            onChange={this.handleChange}
                        />PP
                </label>
                <label>
                    <input
                            type="radio"
                            name="graphParam"
                            value="accuracy"
                            checked={this.state.graphParam==="accuracy"}
                            onChange={this.handleChange}
                        />Accuracy
                </label>
                <label>
                    <input
                            type="radio"
                            name="graphParam"
                            value="playcount"
                            checked={this.state.graphParam==="playcount"}
                            onChange={this.handleChange}
                        />Playcount
                </label>
                </div>
                <ResponsiveContainer height={200} width='100%'>
                    <LineChart data={modified} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <XAxis interval="preserveStart" dataKey="date" tick={{ fontSize: 10 }} />
                        {this.state.graphParam==="accuracy"? accAxis:otherAxis}
                        <CartesianGrid stroke="#909090" fill='white' strokeDasharray="5 5" />
                        <Tooltip />
                        <Line type="monotone" strokeWidth={2} dataKey={this.state.graphParam} stroke="#ffa4b3" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }
}
