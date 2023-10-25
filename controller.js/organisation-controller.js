const Organisation = require("../model/Organisation");

// add organisation
const addOrganisation = async (req, res) => {
    const { orgName, orgAddress, orgCode, orgAdmins } = req.body;
    try {

        // Check if organization with the given code already exists
        const existingOrg = await Organisation.findOne({ orgCode: orgCode });
        if (existingOrg) {
            return res.status(400).json({ code: 400, status_code: "error", error: 'Organization with this code already exists' });
        }

        // Create a new organization
        const newOrg = new Organisation({
            orgName,
            orgAddress,
            orgCode,
            orgAdmins,
        });

        // Save the organization to the database
        await newOrg.save();
        return res.status(201).json({ data: newOrg, code: 201, status_code: "success", message: "Organisation added successfully." })
    } catch (error) {

        console.log('e', error);
        res.status(500).json({ code: 500, status_code: "error", error: 'An error occurred while registering the organisation' });
    }
}

// get all organisations
const getOrganisations = async (req, res, next) => {
    let orgs = ''
    try {
        orgs = await Organisation.find()
    } catch (err) {
        return next(err)
    }

    if (!orgs) {
        return res.status(500).json({ code: 500, status_code: "error", message: "Internal server error" })
    }

    return res.status(200).json({ data: orgs, code: 200, status_code: "success", message: "orgs fetched successfully" })
}

// Update organisation
const updateOrganisation = async (req, res, next) => {
    const orgId = req.params.orgId;
    const { orgName, orgAddress, orgCode, orgAdmins } = req.body;

    try {
        // Find the organization by ID
        const existingOrg = await Organisation.findById(orgId);

        if (!existingOrg) {
            return res.status(404).json({ code: 404, status_code: "error", error: 'Organization not found' });
        }

        // Update organization fields
        existingOrg.orgName = orgName || existingOrg.orgName;
        existingOrg.orgAddress = orgAddress || existingOrg.orgAddress;
        existingOrg.orgCode = orgCode || existingOrg.orgCode;
        existingOrg.orgAdmins = orgAdmins || existingOrg.orgAdmins;

        // Save the updated organization to the database
        await existingOrg.save();

        return res.status(202).json({ data: existingOrg, code: 202, status_code: "success", message: "Organization updated successfully" });
    } catch (error) {
        console.log('e', error);
        res.status(500).json({ code: 500, status_code: "error", error: 'An error occurred while updating the organization' });
    }
};


//get organisation by id
const getOrganisationById = async (req, res, next) => {
    try {
        const orgId = req.params.orgId;
        if (!orgId) {
            return res.status(400).json({ code: 404, status_code: "error", error: 'organisation id required' });
        }
        const org = await Organisation.findById(orgId)
        console.log("======", org)
        return res.status(200).json({ data: org, code: 200, status_code: "success", message: " data fetched successfully" })
    } catch (error) {
        res.status(500).json({ code: 500, status_code: "error", error: "An error occured while fetching organisation" })
    }
}

exports.addOrganisation = addOrganisation;
exports.getOrganisations = getOrganisations;
exports.updateOrganisation = updateOrganisation;
exports.getOrganisationById = getOrganisationById;