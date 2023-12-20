const express = require("express");
const { addUser, addUpdateUser, updateName, addScore, getAllUsers, addOrgAdminUser, updateOrgAdminDetails, getUserById, sendOTPMessage } = require("../controller.js/user-controller");
const { verifyToken, verifyAdminToken, } = require("../middleware/jwt-token");
const router = express.Router();

// public routes
router.post("/add", addUser);
router.put("/addUpdateUser", addUpdateUser);
router.post("/sendOTP", sendOTPMessage);
router.put("/addOrgAdminUser", addOrgAdminUser);

// protected routes
router.post("/updateName", verifyToken, updateName);
router.post("/addScore", verifyToken, addScore);
router.get("/", verifyAdminToken, getAllUsers);
router.post("/updateOrgAdminDetails",verifyToken, updateOrgAdminDetails);
router.get("/getUserById",verifyToken, getUserById);

module.exports = router;