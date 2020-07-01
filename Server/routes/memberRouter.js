const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const crypto = require("crypto");

router.post("/join", async (req, res) => {
  try {
    let findUserEmail = await User.findOne({ email: req.body.email });
    let findNickName = await User.findOne({ nickName: req.body.nickName });

    if (findUserEmail) {
      res.json({
        message: "이메일이 중복되었습니다. 새로운 이메일을 입력해주세요.",
        isEmail: true
      });
    } else if(findNickName) {
      res.json({
        message: "닉네임이 중복되었습니다. 새로운 닉네임을 입력해주세요.",
        isNickName: true
      });
    } else {
      // 64바이트 길이의 salt를 생성
      crypto.randomBytes(64, (err, buf) => {
        if (err) {
          console.log(err);
        } else {
          // 단방향 암호화할 때 가장 선호하는 방식
          crypto.pbkdf2(
            req.body.password,
            buf.toString("base64"),
            101652,
            64,
            "sha512",
            async (err, key) => {
              if (err) {
                console.log(err);
              } else {
                console.log(key.toString("base64"));
                buf.toString("base64");
                obj = {
                  email: req.body.email,
                  nickName: req.body.nickName,
                  password: key.toString("base64"),
                  salt: buf.toString("base64")
                };
                user = new User(obj);
                await user.save();
                res.json({ message: "회원가입 되었습니다!" });
              }
            }
          );
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/login", async (req, res) => {
  try {
    //이메일 값으로 아이디가 존재하는지 확인
    await User.findOne({ email: req.body.email }, async (err, user) => {
      if (err) {
        console.log(err);
      } else {
        if (user) {
          //아이디가 존재할 경우 이메일과 패스워드가 일치하는 회원이 있는지 확인
          console.log(req.body.password);
          console.log(user.salt);
          crypto.pbkdf2(
            req.body.password,
            user.salt,
            101652,
            64,
            "sha512",
            async (err, key) => {
              if (err) {
                console.log(err);
              } else {
                const obj = {
                  email: req.body.email,
                  password: key.toString("base64")
                };

                const user2 = await User.findOne(obj);
                console.log(user2);
                if (user2) {
                  // 있으면 로그인 처리
                  await User.updateOne(
                    {
                      email: req.body.email
                    },
                    { $set: { loginCnt: 0 } }
                  );
                  req.session.email = user.email;
                  res.json({
                    message: "로그인 되었습니다!",
                    _id: user2._id,
                    email: user2.email
                  });
                } else {
                  //없으면 로그인 실패
                  res.json({
                    message: "아이디나 패스워드가 일치하지 않습니다."
                  });
                }
              }
            }
          );
        } else {
          //없으면 로그인 실패
          res.json({ message: "아이디나 패스워드가 일치하지 않습니다." });
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.json({ message: "로그인 실패" });
  }
});

router.get("/logout", (req, res) => {
    console.log("/logout" + req.sessionID);
    req.session.destroy(() => {
      res.json({ message: true });
    });
  });

module.exports = router;