const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    token: {
        type: String,
        default: null
    },
    name: {
        type: String,
    },
    mobileNo: {
        type: String,
        required: true,
        unique: true,
        minlength: 10
    },
    stream: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    result: {
        type: Array,
        default: []
    },
    type: {
        type: String,
        default: 'user'
    },
    referredBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    referralPoints: {
        type: Number,
        default: 0
    },
    orgCode: {
        type: String,
    },
    organisationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organisation',
    },
    designation: {
        type: String,
    }

})

module.exports = mongoose.model("User", userSchema);