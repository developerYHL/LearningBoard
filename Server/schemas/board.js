const mongoose = require("mongoose");

const { Schema } = mongoose;

const boardSchema = new Schema({
  writer: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imgPath: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Board", boardSchema);
