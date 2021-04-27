const express = require('express');

const session = require('express-session'); 

const knexSessionStore = require('connect-session-knex')(session); 


const loggedInCheck = require('./auth/logged-in-check-middleware.js'); 





const usersRouter = require("./users/users-router.js");
const authRouter = require("./auth/auth-router.js");


const server = express();

const sessionConfig = {
    name: 'monkey',
    secret: 'super secret',
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false, // should be true in production
      httpOnly: true
    },
    resave: false,
    saveUninitialized: false,

    store: new knexSessionStore(
      {
        knex: require("../data/connection.js"),
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 1000 * 60 * 60
      }
    )
  }

  server.use(express.json());

  server.use(session(sessionConfig));


  server.use("/api/users", loggedInCheck, usersRouter);
  server.use("/api/auth", authRouter);

  server.get("/", (req, res) => {
    res.json({ api: "up" });
  });

  module.exports = server; 