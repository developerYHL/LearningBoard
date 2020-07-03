const mongoose = require("mongoose");

module.exports = () => {
  const connect = () => {
    mongoose.set("debug", true);
    mongoose.set('useCreateIndex', true);
    mongoose.connect(
      "mongodb://localhost:27017/project",
      {
        dbName: "project",
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      error => {
        if (error) {
          console.log("DB connect error", error);
        } else {
          console.log("DB connect!!!");
        }
      }
    );
  };

  connect();

  mongoose.connection.on("error", error => {
    console.log("DB connect error", error);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("DB disconnected, Retry Connection");
    connect();
  });
  
  require("./user");
  require("./board");
  require("./comment");
};
