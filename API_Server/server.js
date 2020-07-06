const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./schemas/index");

// environment variables setup
dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV == "production" ? ".env" : ".env.dev"
  )
});

dbConnect();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/member", require("./routes/memberRouter"));
app.use("/board", require("./routes/boardRouter"));
app.use("/comment", require("./routes/commentRouter"))

app.listen(8080, () => {
  console.log("Server Start !!!");
});