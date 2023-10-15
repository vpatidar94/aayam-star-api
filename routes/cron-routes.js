const express = require("express");
const { verifyAdminToken } = require("../middleware/jwt-token");
const { updateUserStream, updateTestSubjectNames, updateTestStreamToArray } = require("../controller.js/cron-controller");
const router = express.Router();

// protected routes
router.get("/updateUserStream", verifyAdminToken, updateUserStream);
router.get("/updateTestSubjectNames", verifyAdminToken, updateTestSubjectNames);
router.get("/updateTestStreamToArray", verifyAdminToken, updateTestStreamToArray);

module.exports = router;