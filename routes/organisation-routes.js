const express = require("express");
const { verifySuperAdminToken, verifySuperAdminAndSubAdminToken, } = require("../middleware/jwt-token");
const router = express.Router();
const { addOrganisation, getOrganisations, updateOrganisation, getOrganisationById, sendLoginMessage } = require("../controller.js/organisation-controller")

// protected routes
router.post("/addOrganisation", verifySuperAdminToken, addOrganisation);
router.get("/", verifySuperAdminAndSubAdminToken, getOrganisations);
router.put("/updateOrganisation/:orgId", verifySuperAdminAndSubAdminToken, updateOrganisation)
router.get("/getOrganisation/:orgId", verifySuperAdminAndSubAdminToken, getOrganisationById)
router.post("/sendLoginMessage", verifySuperAdminAndSubAdminToken, sendLoginMessage);

module.exports = router;