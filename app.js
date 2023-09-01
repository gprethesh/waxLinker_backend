const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const homeRouter = require("./router/home");
const twitterRoutes = require("./router/twitterRoutes");

const app = express();

const corsOptions = {
  origin: "*", // Replace with the actual origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "Access-Control-Allow-Origin",
  ],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_API_KEY, // Your Twitter API Key
      consumerSecret: process.env.TWITTER_API_SECRET_KEY, // Your Twitter API Secret Key
      callbackURL: `${process.env.DOMAIN}/api/auth/twitter/callback`,
    },
    (token, tokenSecret, profile, done) => {
      // token and tokenSecret here are the user's Access Token and Access Token Secret

      profile.twitter_token = token;
      profile.twitter_tokenSecret = tokenSecret;

      return done(null, profile);
    }
  )
);

app.use("/api", homeRouter);

app.use("/api", twitterRoutes);

const path = require("path");

// serve the react app files
app.use(express.static(`${__dirname}/dist`));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

module.exports = app;
