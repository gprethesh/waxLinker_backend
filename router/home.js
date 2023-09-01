const express = require("express");
const router = express.Router();

// calling this from controller
const { home } = require("../controller/homeController");

router.route("/").get(home);

module.exports = router;
