const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  authenticateTwitter,
  twitterCallback,
} = require("../controller/twitterController");

router.get("/auth/twitter", authenticateTwitter);

router
  .route("/auth/twitter/callback")
  .get(
    passport.authenticate("twitter", { failureRedirect: "/" }),
    twitterCallback
  );

module.exports = router;
