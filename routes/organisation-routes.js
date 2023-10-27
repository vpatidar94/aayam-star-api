const express = require("express");
const { verifyToken, verifyAdminToken, verifySuperAdminToken, } = require("../middleware/jwt-token");
const router = express.Router();
const { addOrganisation, getOrganisations, updateOrganisation, getOrganisationById } = require("../controller.js/organisation-controller")

// protected routes
router.post("/addOrganisation", verifySuperAdminToken, addOrganisation);
router.get("/", verifySuperAdminToken, getOrganisations);
router.put("/updateOrganisation/:orgId", verifySuperAdminToken, updateOrganisation)
router.get("/getOrganisation/:orgId", verifySuperAdminToken, getOrganisationById)

module.exports = router;