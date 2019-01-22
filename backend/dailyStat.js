// dailyStats Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const DataSchema = new Schema(
  {
    id: Number,
    date: Date,
    count300: Number,
    count100: Number,
    count50: Number,
    playcount: Number,
    ranked_score: Number,
    total_score: Number,
    pp_rank: Number,
    level: Number,
    pp_raw: Number,
    accuracy: Number,
    total_seconds_played: Number,
    pp_country_rank: Number
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("dailyStat", DataSchema);