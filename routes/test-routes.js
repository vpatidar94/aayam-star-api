const express = require("express");
const { verifyToken } = require("../middleware/jwt-token");
const { addTest, getTest, submitResult } = require("../controller.js/test-controller");
const router = express.Router();

// protected routes
router.post("/addTest", verifyToken, addTest);
router.get("/getTest/:testId", verifyToken, getTest);
router.post("/submitResult", verifyToken, submitResult);


module.exports = router;