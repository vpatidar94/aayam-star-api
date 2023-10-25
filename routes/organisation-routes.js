const express = require("express");
const { verifyToken, verifyAdminToken, } = require("../middleware/jwt-token");
const router = express.Router();
const { addOrganisation, getOrganisations, updateOrganisation, getOrganisationById } = require("../controller.js/organisation-controller")

// protected routes
router.post("/addOrganisation", verifyAdminToken, addOrganisation);
router.get("/", verifyAdminToken, getOrganisations);
router.put("/updateOrganisation/:orgId", verifyAdminToken, updateOrganisation)
router.get("/getOrganisation/:orgId", verifyAdminToken, getOrganisationById)

module.exports = router;