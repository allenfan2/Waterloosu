import React, { Component } from "react";

class App extends Component {
  // initialize our state 
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has 
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 5000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever 
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }


  // our first get method that uses our backend api to 
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getPlayers")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };



  render() {
    const { data } = this.state;
    return (
      <div>
        <ul>
          {data.length <= 0
            ? "NO DB ENTRIES YET"
            : data.map(dat => (
                <li style={{ padding: "10px" }} key={dat.id}>
                  <span > Username: {dat.username} </span> <br/>
                  <span > Join Date: {dat.join_date} </span> <br/>
                  <span > Country: {dat.country} </span> <br/>
                </li>
              ))}
        </ul>
        <h1>test</h1>
      </div>
    );
  }
}

export default App;
