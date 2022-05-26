"use strict"
const Controller = require('../controllers/index')
const express = require("express");
const router = express.Router();

router.use('/', Controller.logOut)

module.exports = router;