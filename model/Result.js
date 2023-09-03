const mongoose = require("mongoose");
const User = require("./User");
const Test = require("./Test");

const Schema = mongoose.Schema;

const resultSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
    },
    score: {
        type: Number,
        required: true,
    },
    rank: {
        type: Number,
    },
    submitDate: {
        type: Date
    }
})

module.exports = mongoose.model("Result", resultSchema);