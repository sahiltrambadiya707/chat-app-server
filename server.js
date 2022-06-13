const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const http = require("http");
const app = express();
const cors = require("cors");
const httpStatus = require("http-status");
const { notFound, errorHandler } = require("./src/middlewares/error");

// Environment variables
dotenv.config({ path: ".env" });
require("dotenv").config();
require("./src/config/db");

//Listen the HTTP Server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});

// Error Handling middleware
// app.use(notFound);
// app.use(errorHandler);

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.options("*", cors());

app.get("/health-check", (req, res) => {
  res.status(httpStatus.OK).send("server health is good");
});

app.use("/api", require("./src/routes/user"));
app.use("/api", require("./src/routes/chat"));
