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
})

module.exports = mongoose.model("User", userSchema);