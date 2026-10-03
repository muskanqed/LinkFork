const express = require("express");
const router = express.Router();
const {signup,login,logout,getMe} = require("./auth.controller");
const authenticate = require("../middlewares/auth.middleware");


router.post('/signup',signup);

router.post('/login',login);

router.post('/logout',logout);

router.get('/me',authenticate,getMe)

module.exports = router;

