const express = require("express");
const getSummary = require("./controller");

router = express.Router();
router.post("/getSummary", getSummary);

module.exports = router;