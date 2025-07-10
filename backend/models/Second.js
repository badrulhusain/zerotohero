const mongoose = require('mongoose');

const secondSchema = new mongoose.Schema({
    candidateId: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Second', secondSchema);