const express = require("express");
const router = express.Router();
const Comment = require("../schemas/comment");
const Board = require("../schemas/board");
const User = require("../schemas/user");

router.post("/write", async (req, res) => {
    try {
        let user = await User.findOne({_id: req.body.writer});
        let obj;
        obj = {
            writer: req.body.writer,
            board: req.body.board,
            nickName: user.nickName,
            content: req.body.content
        };
        console.log(obj);

        const comment = new Comment(obj);
        await comment.save();
        res.json({ comment: comment });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

router.post("/update", async (req, res) => {
    try{
        await Comment.update({ _id: req.body._id }, {
            $set: {
                content: req.body.content
            }
        });
        res.json({message: "댓글이 수정 되었습니다."});
    }catch(err) {
        console.log(err);
        res.json({ message: false });
    }
});

router.post("/delete", async (req, res) => {
    try {
        await Comment.remove({_id: req.body._id});
        res.json({ message: true });
    } catch (err) {
        res.json({ message: false });
    }
})

router.post("/getCommentList", async (req, res) => {
    try {
        let comment = await Comment.find({board: req.body.board}, null, {
            sort: { createdAt: -1 }
        });
        res.json({ list: comment });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

module.exports = router;