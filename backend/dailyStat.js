// dailyStats Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const DataSchema = new Schema(
  {
    id: Number,
    date: Date,
    username: String,
    join_date: Date,
    country: String,
    playcount: Number,
    ranked_score: Number,
    total_score: Number,
    pp_rank: Number,
    level: Number,
    pp_raw: Number,
    accuracy: Number,
    total_seconds_played: Number,
    pp_country_rank: Number,
    events:Array
  }
);

module.exports = mongoose.model("dailyStat", DataSchema);