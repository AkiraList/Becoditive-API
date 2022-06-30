const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({
    donor: Boolean,
    date: {
        type: String,
        default: Date.now
    },
    owner: {
        type: String,
        default: ""
    },
    clicks: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    urlCode: String,
    longUrl: String,
    shortUrl: String,
});
module.exports = mongoose.model('short urls', urlSchema)
