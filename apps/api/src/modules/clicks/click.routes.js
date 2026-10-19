const express = require("express");
const authenticate = require("../middlewares/auth.middleware.js");
const { getClicksByUrlId, getAllUserClicks } = require("./click.controller.js");

const router = express.Router();

router.get("/:urlId", authenticate, getClicksByUrlId);
router.get("/", authenticate, getAllUserClicks);

module.exports = router;
