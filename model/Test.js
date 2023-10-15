const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const test = new Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
    },
    subjectName: {
        type: String,
        required: true,
    },
    stream: {
        type: Array,
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    },
    questions: {
        type: Array,
        default: []
    },
    passingScore: {
        type: Number,
        required: true,
    },
    testDate: {
        type: Date,
        required: true,
    },
    testDuration: {
        type: Number,
        default: 0,
        required: true,
    },
    resultDate: {
        type: Date,
    },
    isRankGenerated: {
        type: Boolean,
        default: false,
    }
})

module.exports = mongoose.model("Test", test);