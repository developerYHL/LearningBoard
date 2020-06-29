const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentSchema = new Schema({
    board: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Board"
    },
    writer: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    nickName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Comment", commentSchema);
