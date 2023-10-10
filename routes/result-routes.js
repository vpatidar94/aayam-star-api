const express = require("express");
const { verifyToken, verifyAdminToken } = require("../middleware/jwt-token");
const { getResultDashboard, generateRank, getResultByTest, getAllScorePoints, sendWpMessage, getAllResultsDetails } = require("../controller.js/result-controller");
const router = express.Router();

// protected routes
router.get("/getResultDashboard", verifyToken, getResultDashboard);
router.get("/getAllScorePoints", verifyToken, getAllScorePoints);


// for admin users
router.get("/generateRank/:testId", verifyAdminToken, generateRank);
router.get("/getResultByTest/:testId", verifyAdminToken, getResultByTest);
router.get("/getAllResultsDetails",verifyAdminToken, getAllResultsDetails);
router.post("/sendWpMessage", verifyAdminToken, sendWpMessage);
module.exports = router;