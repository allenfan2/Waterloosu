const CronJob = require('cron').CronJob;
const Promise = require('bluebird')
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

mongoose.Promise = Promise

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// DB connection error
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//Logging
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
//app.use(logger("dev"));

const players = ["Ciao","Megumi Kato","deetz","DollarPlus","influxd"]


function refresh(){
    const indexArray = players.map(p=>filterPlayers(p))
    Promise.all(indexArray).then(
        (doc)=>{
            let newPlayer = []
            for (i = 0; i<doc.length;++i){
                if (doc[i] === null){
                    newPlayer.push(players[i])
                }
            }
            updatePlayers(newPlayer)
        }
    )
}


function filterPlayers(pname){
    const query = playerInfo.findOne({username: pname});
    const promise = query.exec()
    return promise
}


function searchPlayer(pname){
    return fetch("https://osu.ppy.sh/api/get_user?k=" + osuAPIKey + "&u=" + pname)
     .then(res => {
         return res.json();
    }).then(res =>{
             return res[0]
    })
}

function updatePlayers(arr){
    let addedArr = arr.map(p=>searchPlayer(p))
    Promise.all(addedArr)
    .then((res)=>{
        addPlayer(res)
    })
    
}

function addPlayer(plist){
    const confList = plist.map(p => {
        const player = new playerInfo({
            id: Number(p.user_id),
            username: p.username,
            join_date: new Date(p.join_date),
            country: p.country,
        });
        console.log(p.username + " has been added to the database")
        return player.save()
    })
    Promise.all(confList).then((res)=>{
        dailyUpdate()
    })
}








refresh()



function dailyUpdate(){
    let playerQuery = playerInfo.find({},{'_id':0,'id':1})
    playerQuery.exec()
    .then((res) => { 
        updateStats(res.map(player=>player.id))
    })
}

function updateStats(p_id){
    const oldDate = new Date()
    const dateNoTime = new Date(oldDate.toDateString())
    p_id.forEach(player => {
        dailyStat.findOne({id: player,date: dateNoTime}, (err, exist)=> {
            if(!exist){
                fetch("https://osu.ppy.sh/api/get_user?k=" + osuAPIKey + "&u=" + player)
                .then(res => {
                    return res.json();
                })
                .then(res => {
                    const ds = new dailyStat({
                        id: res[0].user_id,
                        date: dateNoTime,
                        playcount:  res[0].playcount,
                        ranked_score:  res[0].ranked_score,
                        total_score:  res[0].total_score,
                        pp_rank:  res[0].pp_rank,
                        level:  res[0].level,
                        pp_raw:  res[0].pp_raw,
                        accuracy:  res[0].accuracy,
                        total_seconds_played:  res[0].total_seconds_played,
                        pp_country_rank:  res[0].pp_country_rank
                    })
                    ds.save((error)=>{
                      console.log("User:"+ player +"'s daily stat has been added to the database!");
                      if (error) {
                          console.error(error);
                      }
                     })
                })            
            } else {
                console.log("User:"+player+"'s entry today already logged")
            }  
        })       
    })   
}       



//var job = new CronJob ('5 0 * * *', ()=>{
//    refresh()
//},
//null,true,'America/Toronto')



//GET METHOD
router.get("/getPlayers", (req, res) => {
  playerInfo.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, data: data });
  });
});

router.get("/getplayerInfo", (req, res) => {
    dailyStat.find((err, data) => {
      if (err) return res.json({ success: false, error: err });
      res.json({ success: true, data: data });
    });
  });

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

//append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));