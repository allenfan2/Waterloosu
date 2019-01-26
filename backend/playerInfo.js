// playerInfo Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const DataSchema = new Schema(
  {
    id: Number,
    username: String,
    join_date: Date,
    country: String,
  }
);

module.exports = mongoose.model("playerInfo", DataSchema);