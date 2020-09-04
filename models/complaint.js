const mongoose = require('mongoose');

var complaintSchema = new mongoose.Schema({
    text: String,
    date: {
        type: String,
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Complaint'
        },
        username: String
    },
    status: {
        type: String,
        default: 'pending'
    }
});

 
// complaintSchema.pre('remove', async function() {
//     await Comment.remove({
//         _id: {
//             $in: this.comments
//         }
//     });
// });

module.exports = mongoose.model('Complaint', complaintSchema);