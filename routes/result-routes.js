const express = require("express");
const { verifyToken } = require("../middleware/jwt-token");
const { getResultDashboard } = require("../controller.js/result-controller");
const router = express.Router();

// protected routes
router.get("/getResultDashboard", verifyToken, getResultDashboard);


module.exports = router;