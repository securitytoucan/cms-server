const mongoose = require('mongoose');
const Complaint = require('../models/complaint')


const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    hash: String,
    salt: String,
    complaints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint"
    }],
    // should not be modified by the http request
    role: {
        type: String,
        default: 'basic'
    }
});

// basically, adding a pre-hook.
// before executing the 'remove' command on a user, wait to remove associated complaints
// complaints are identified by using the _id field which is available 'in' the 'complaints' attribute of user  
UserSchema.pre('remove', async function() {
    await Complaint.remove({
        _id: {
            $in: this.complaints
        }
    });
});
// doesnt work yet because you need to add some code before user deletion
// do this in the INDEX routes - /delete user


module.exports = mongoose.model('User', UserSchema);