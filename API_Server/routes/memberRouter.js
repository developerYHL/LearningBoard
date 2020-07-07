const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const crypto = require("crypto");

router.post("/join", async (req, res) => {
  try {
    let OverlapEmail = await User.findOne({ email: req.body.email });
    let OverlapNickName = await User.findOne({ nickName: req.body.nickName });

    if (OverlapEmail) {
      res.json({
        message: "이메일이 중복되었습니다. 새로운 이메일을 입력해주세요.",
        isEmail: true
      });
      return;
    }

    if (OverlapNickName) {
      res.json({
        message: "닉네임이 중복되었습니다. 새로운 닉네임을 입력해주세요.",
        isNickName: true
      });
      return;
    }

    crypto.randomBytes(parseInt(process.env.keyLength), (err, buf) => {
      if (err) {
        console.log(err);
      } else {
        crypto.pbkdf2(
          req.body.password,
          buf.toString(process.env.encodingType),
          parseInt(process.env.iterations),
          parseInt(process.env.keyLength),
          process.env.digest,
          async (err, key) => {
            if (err) {
              console.log(err);
            } else {
              obj = {
                email: req.body.email,
                nickName: req.body.nickName,
                password: key.toString(process.env.encodingType),
                salt: buf.toString(process.env.encodingType)
              };
              const user = new User(obj);
              await user.save();
              res.json({ message: "회원가입 되었습니다!" });
            }
          }
        );
      }
    });
  } catch (err) {
    res.json({ message: false });
  }
});

router.post("/login", async (req, res) => {
  try {
    await User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        if (user) {
          crypto.pbkdf2(
            req.body.password,
            user.salt,
            parseInt(process.env.iterations),
            parseInt(process.env.keyLength),
            process.env.digest,
            (err, key) => {
              if (err) {
                console.log(err);
              } else {
                if (user.password === key.toString(process.env.encodingType)) {
                  res.json({
                    message: "로그인 되었습니다!",
                    _id: user._id,
                    email: user.email
                  });
                } else {
                  res.json({ message: "아이디나 패스워드가 일치하지 않습니다." });
                }
              }
            }
          );
        } else {
          res.json({ message: "아이디나 패스워드가 일치하지 않습니다." });
        }
      }
    });
  } catch (err) {
    res.json({ message: false });
  }
});

module.exports = router;