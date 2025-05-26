const express = require("express");
const getSummary = require("./controller");

router = express.Router();
router.post("/process-meeting", getSummary);

module.exports = router;