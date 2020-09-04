const mongoose = require('mongoose');


const adminSchema = mongoose.Schema({
    username: String,
    email: String,
    hash: String,
    salt: String,
    allComplaints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint"
    }],
        // should not be modified by the http request
    role:{
        type: String,
        default: 'admin'
    }
})

module.exports = mongoose.model('Admin', adminSchema);