const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrganisationSchema = new Schema({
    orgName: {
        type: String,
        default: null
    },
    orgAddress: {
        type: String,
        default: null
    },
    orgCode: {
        type: String,
        required: true,
        unique: true,
    },
    orgAdmins: {
        type: [String], 
        default: [],
    },
    invitation: [{
        mobileNo: {
            type: String,
            default:null
        },
        isAccepted: {
            type: Boolean,
            default: false,
        },
    }],
    image: {
        type: String, 
        default: null,
    },
    isAllowed: {
        type: Boolean,
        default: true
    }


})

module.exports = mongoose.model("Organisation", OrganisationSchema)