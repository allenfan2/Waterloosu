const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const playerInfo = require("./playerInfo");
const dailyStat = require("./dailyStat");
const osuAPIKey = '259ac227b4133eddbb00cb52e15f47a635684f2e';
const fetch = require("node-fetch");
const API_PORT = 3001;
const app = express();
const router = express.Router();

// DB
const dbRoute = "mongodb://admin:CMqb9rhHgn4NHdH@ds257752.mlab.com:57752/waterloosu";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//Logging
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
//app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
const players = ["Ciao", "Megumi Kato","deetz","DollarPlus","influxd",""]

function addPlayers(){
    players.forEach(p => {
        playerInfo.findOne({username: p}, (err, exist)=> {
            if (!exist) {
                fetch("https://osu.ppy.sh/api/get_user?k=" + osuAPIKey + "&u=" + p)
                    .then(res => {
                        return res.json();
                    })
                    .then(res => {
                        const player = new playerInfo({
                            id: Number(res[0].user_id),
                            username: res[0].username,
                            join_date: new Date(res[0].join_date),
                            country: res[0].country,
                        });
                        player.save((error)=> {
                            console.log(p+" has been added to the database!");
                            if (error) {
                                console.error(error);
                            }
                        });
                    });
               }
        })

    });
}

function dailyUpdate(){
    players.forEach(p=> {
        
    })
}


//const player = new playerInfo({
//    id: 1,
//    username: "Ciao",
//    join_date: new Date(),
//    country: 'CA',
//});

//player.save(function(error) {
//    console.log("Your player has been saved!");
//if (error) {
//    console.error(error);
// }
//});




//router.get("/", (req, res) => {
//  Data.find((err, data) => {
//    if (err) return res.json({ success: false, error: err });
//    res.json({ success: true data: data });
//  });
//});

//// this is our update method
//// this method overwrites existing data in our database
//router.post("/updateData", (req, res) => {
//  const { id, update } = req.body;
//  Data.findOneAndUpdate(id, update, err => {
//    if (err) return res.json({ success: false, error: err });
//    return res.json({ success: true });
//  });
//});
//
//// this is our delete method
//// this method removes existing data in our database
//router.delete("/deleteData", (req, res) => {
//  const { id } = req.body;
//  Data.findOneAndDelete(id, err => {
//    if (err) return res.send(err);
//    return res.json({ success: true });
//  });
//});
//
//// this is our create methid
//// this method adds new data in our database
//router.post("/putData", (req, res) => {
//  let data = new Data();
//
//  const { id, message } = req.body;
//
//  if ((!id && id !== 0) || !message) {
//    return res.json({
//      success: false,
//      error: "INVALID INPUTS"
//    });
//  }
//  data.message = message;
//  data.id = id;
//  data.save(err => {
//    if (err) return res.json({ success: false, error: err });
//    return res.json({ success: true });
//  });
//});

// append /api for our http requests
//app.use("/api", router);
//
//// launch our backend into a port
//app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
