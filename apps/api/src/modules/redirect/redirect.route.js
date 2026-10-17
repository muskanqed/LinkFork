const express = require("express")

const { redirect } = require("./redirect.controller")

const router = express.Router()

router.get("/:shortCode", redirect)

module.exports = router;