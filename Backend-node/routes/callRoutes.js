const express = require("express");
const router = express.Router();
const { createCall, getCall } = require("../controllers/callController");

router.post("/save-call", createCall);
router.get("/get-call/:id", getCall);

module.exports = router;
