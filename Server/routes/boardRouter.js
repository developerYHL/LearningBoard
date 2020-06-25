const express = require("express");
const router = express.Router();
const Board = require("../schemas/board");
const User = require("../schemas/user");

router.post("/write", async (req, res) => {
    try {
        let obj;
        obj = {
            writer: req.body._id,
            title: req.body.title,
            content: req.body.content
        };

        const board = new Board(obj);
        await board.save();
        res.json({ message: "게시글이 업로드 되었습니다." });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

router.post("/getBoardList", async (req, res) => {
    try {
        let boardList;
        let boards = await Board.find(null, null, {
            sort: { createdAt: -1 }
        });

        // writer로 user의 nickName을 찾아서 넣어줘야함 (외래키 검색해보기)
        // boardList = boards.map(item => ());

        res.json({ list: board });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

router.post("/detail", async (req, res) => {
    try {
        const _id = req.body._id;
        const board = await Board.findOne({_id: _id });
        console.log(board);
        res.json({ board });
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

module.exports = router;