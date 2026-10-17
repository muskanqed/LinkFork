const express = require("express");

const {
  createUrl,
  getUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
} = require("./url.controller");

const authenticate = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/createUrl", authenticate, createUrl);
router.get("/", authenticate, getUrls);
router.get("/:id", authenticate, getUrlById);
router.put("/:id", authenticate, updateUrl);
router.delete("/:id", authenticate, deleteUrl);

module.exports = router;