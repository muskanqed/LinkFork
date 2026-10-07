const express = require("express");

const {
  createUrl,
  getUrls,
} = require("./url.controller");

const authenticate = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authenticate, getUrls);

router.post("/createUrl", authenticate, createUrl);

module.exports = router;