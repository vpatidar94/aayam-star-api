const express = require("express");
const { verifyToken, verifyAdminToken } = require("../middleware/jwt-token");
const { getResultDashboard, generateRank, getResultByTest } = require("../controller.js/result-controller");
const router = express.Router();

// protected routes
router.get("/getResultDashboard", verifyToken, getResultDashboard);

// for admin users
router.get("/generateRank/:testId", verifyAdminToken, generateRank);
router.get("/getResultByTest/:testId", verifyAdminToken, getResultByTest);

module.exports = router;