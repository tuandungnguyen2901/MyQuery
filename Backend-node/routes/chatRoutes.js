const express = require("express");

const { createUser, getUser } = require("../controllers/chatController.js");

const router = express.Router();

router.post("/create-user", createUser);
router.post("/get-user", getUser);

module.exports = router;
