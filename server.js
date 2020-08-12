//import express, userrouter, postrouter, connect server and express
const express = require("express");
const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");
const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
server.use(logger);
server.use(userRouter);
server.use(postRouter);

function logger(req, res, next) {
  console.log(`${req.method} Request ${req.url} [${newDate().toISOString()}]`);
  next();
}

module.exports = server;
