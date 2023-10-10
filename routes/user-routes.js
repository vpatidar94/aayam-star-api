const express = require("express");
const { addUser, addUpdateUser, updateName, addScore, getAllUsers } = require("../controller.js/user-controller");
const { verifyToken, verifyAdminToken, } = require("../middleware/jwt-token");
const router = express.Router();

// public routes
router.post("/add", addUser);
router.put("/addUpdateUser", addUpdateUser);

// protected routes
router.post("/updateName", verifyToken, updateName);
router.post("/addScore", verifyToken, addScore);
router.get("/",verifyAdminToken, getAllUsers);

module.exports = router;