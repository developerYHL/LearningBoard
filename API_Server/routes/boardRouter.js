const express = require("express");
const router = express.Router();
const Board = require("../schemas/board");
const User = require("../schemas/user");

const boardRange = 3;

router.post("/write", async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.body._id });
        let obj = {
            writer: req.body._id,
            nickName: user.nickName,
            title: req.body.title,
            content: req.body.content
        };
        const board = new Board(obj);
        await board.save();
        res.json({ message: "게시글이 업로드 되었습니다." });
    } catch (err) {
        res.json({ message: false });
    }
});

router.post("/detail", async (req, res) => {
    try {
        const _id = req.body._id;
        const board = await Board.findOne({ _id: _id });
        res.json({ board });
    } catch (err) {
        res.json({ message: false });
    }
});

router.post("/update", async (req, res) => {
    try {
        await Board.update({ _id: req.body._id }, {
            $set: {
                title: req.body.title,
                content: req.body.content
            }
        });
        res.json({ message: "게시글이 수정 되었습니다." });
    } catch (err) {
        res.json({ message: false });
    }
});

router.post("/delete", async (req, res) => {
    try {
        await Board.remove({ _id: req.body._id });
        res.json({ message: "게시글이 삭제 되었습니다." });
    } catch (err) {
        res.json({ message: false });
    }
})

router.post("/getBoardList", async (req, res) => {
    try {
        let page = req.body.page;
        let board = await Board.find(null, null, {
            sort: { createdAt: -1 }
        }).skip(((page - 1) * boardRange)).limit(boardRange);
        res.json({ list: board });
    } catch (err) {
        res.json({ message: false });
    }
});

router.get("/getLastPage", async (req, res) => {
    try {
        let boardCount = await Board.countDocuments();
        res.json({ count: Math.ceil(boardCount / boardRange) });
    } catch (err) {
        res.json({ message: false });
    }
});

router.post("/getAssessmentCnt", async (req, res) => {
    try {
        let board = await Board.findOne({ _id: req.body._id }, null);
        res.json({
            likeCnt: board.likeCnt,
            badCnt: board.badCnt
        });
    } catch (err) {
        res.json({ message: false });
    }
});

router.post("/addAssessmentCnt", async (req, res) => {
    try {
        let assesmentUsers = await Board.findOne({ _id: req.body._id });
        if (assesmentUsers.assessmentUser.indexOf(req.body.writer) > -1) {
            res.json({ message: "이미 추천 하셨습니다." });
            return;
        }

        if (req.body.isLike) {
            await Board.updateOne({ _id: req.body._id },
                {
                    $inc: {
                        likeCnt: 1
                    },
                    $push: {
                        assessmentUser: req.body.writer
                    }
                });
            res.json({ isLike: true });
        } else {
            await Board.updateOne({ _id: req.body._id },
                {
                    $inc: {
                        badCnt: 1
                    },
                    $push: {
                        assessmentUser: req.body.writer
                    }
                });
            res.json({ isLike: false });
        }
    } catch (err) {
        res.json({ message: false });
    }
});

module.exports = router;