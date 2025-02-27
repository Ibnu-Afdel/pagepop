const config = require("./utils/config");
const express = require("express");
const app = require("./app");
const cors = require("cors");
const bookRoute = require("./controllers/books");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("Connecting to mongoDB: ", config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI).then(() => {
  logger.info("Connected to MongoDB");
});

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/books", bookRoute);

app.use(middleware.unknownEndpoint);

module.exports = app;
