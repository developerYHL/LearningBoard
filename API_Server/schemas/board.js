const mongoose = require("mongoose");

const { Schema } = mongoose;

const boardSchema = new Schema({
  writer: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  nickName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likeCnt: {
    type: Number,
    default: 0
  },
  badCnt: {
    type: Number,
    default: 0
  },
  assessmentUser: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  ]
});

module.exports = mongoose.model("Board", boardSchema);
