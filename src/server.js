const cors = require("cors");
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const initRoutes = require("./routes");
const dbConfig = require("./config/db");

const port = 8000;
let server;

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
initRoutes(app);

mongoose.set("strictQuery", false);
mongoose.connect(dbConfig.url, dbConfig.options).then(() => {
  console.log('Connected to MongoDB');
  server = app.listen(port, () => {
    console.log(`Running at localhost:${port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});