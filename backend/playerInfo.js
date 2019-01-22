// playerInfo Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const DataSchema = new Schema(
  {
    id: Number,
    username: String,
    join_date: Date,
    country: String,
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("playerInfo", DataSchema);