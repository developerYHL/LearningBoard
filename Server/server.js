const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const dbConnect = require("./schemas/index");

dbConnect();

// 서버와 클라이언트가 서로 다른 포트를 사용함으로써 발생하는 이슈 해결
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "hansung",
    cookie: {
      httpOnly: true,
      secure: false
    }
  })
);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/member", require("./routes/memberRouter"));
app.use("/board", require("./routes/boardRouter"));
app.use("/comment", require("./routes/commentRouter"))

app.listen(8080, () => {
  console.log("Server Start !!!");
});