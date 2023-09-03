const express = require("express");
const { addUser, addUpdateUser, updateName, addScore } = require("../controller.js/user-controller");
const { verifyToken } = require("../middleware/jwt-token");
const router = express.Router();

// public routes
// router.get("/", getAllUsers);
router.post("/add", addUser);
router.put("/addUpdateUser", addUpdateUser);

// protected routes
router.post("/updateName", verifyToken, updateName);
router.post("/addScore", verifyToken, addScore);

module.exports = router;