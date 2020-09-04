const router = require('express').Router();
const Complaint = require('../models/complaint');
const User = require('../models/user');
const utils = require('../lib/utils')
const passport = require('passport');
const moment = require('moment');


// INDEX - display user's complaints
router.get('/complaints', passport.authenticate('jwt', {session: false}), utils.grantAccess('readOwn', 'complaints'), (req,res) => {
    User.findById(req.user._id).populate("complaints")
    .then((user) => {
        const complaintsToSend = []
        user.complaints.forEach(element => {
            // console.log(element)
            complaintsToSend.push({
                id: element._id,
                text: element.text,
                date: moment(element.date)
            });
        });

        res.status(200).json({complaints: complaintsToSend})
    })
    .catch(error => {
        console.log("error in retrieveing complaints"); 
        console.log(error);
    })
});

// CREATE
// create and save complaint in the appropriate USER object
router.post('/complaints', passport.authenticate('jwt', {session: false}), utils.grantAccess('createOwn', 'complaint'), (req,res) => {
    console.log(req.body)
    
    User.findById(req.user._id)
        .then((user) => {
            var complaint = {
                text: req.body.text,
                // date: moment(req.body.date).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                date: req.body.date,
                author: {
                    id: user._id,
                    username: user.username
                }
            }
            Complaint.create(complaint)
            .then((complaint) => {
                console.log("successfully created complaint");
                complaint.save();
                user.complaints.push(complaint);
                user.save();
                console.log("complaint saved");
                console.log(user.complaints)
                res.status(200).json({success: true, complaint: complaint});
            })
            .catch(err => res.status(500).json({success: false, msg: "Could not register complaint"}))
        })
        .catch(err => {
            res.status(404).json({success: false, msg: "user not found"});
        })

    
});

// UPDATE 
router.put('/complaints/:id', passport.authenticate('jwt', {session: false}), utils.grantAccess('updateOwn', 'complaint'), (req,res) => {
    Complaint.findByIdAndUpdate(req.params.id, req.body)
    .then((complaint) => {
        console.log("successfully updated complaint");
        console.log(complaint)
        res.status(200)
    })
    .catch(err => {
        console.log("error in update");
        console.log(err)
    });
});

// DELETE
router.delete('/complaints/:id', passport.authenticate('jwt', {session: false}), utils.grantAccess('deleteOwn', 'complaint'), (req,res) => {
    // User.findById(req.user._id)
    // .then((user) => {
    //     user.complaints.forEach(complaintId => {
    //         if (complaintId.equals(req.params.id)) {
    //             var complaintIndex = user.comments.indexOf(String(complaintId));
    //             user.comments.splice(complaintIndex,1);
    //         }
    //     })
    //     console.log(user.comments)
    // })
    // .catch(err => {
    //     console.log(err)
    // })
    Complaint.findByIdAndDelete( req.params.id)
    .then((complaint) =>  {
        console.log("successfully deleted complaint");
        console.log(complaint);

        // delete from user's list also
        // replace user's comments array - clear it using splice(0, user.comments.length-1)
        // then - push all id's except the deleted one

        res.status(200);
    })
    .catch(err => {
        console.log("error in delete");
        console.log(err);
        res.status(500);
    })
});

// =============
// ADMIN ROUTES
// =============

// ADMIN INDEX
router.get('/admin/complaints', passport.authenticate('jwt', {session: false}), utils.grantAccess('readAny', 'complaints'), (req,res) => {
    // get all complaints
    Complaint.find()
    .then(complaints => {
        console.log(complaints);
        res.status(200).json({success: true, allComplaints: complaints});
    })
    .catch(err => {
        console.log("error in retrieving complaints");
        console.log(err)
    });
})

// ADMIN UPDATE
router.put('/admin/complaints/:id', passport.authenticate('jwt', {session: false}), utils.grantAccess('updateAny', 'complaint'), (req,res) => {
    Complaint.findByIdAndUpdate(req.params.id, req.body)
    .then((complaint) => {
        console.log("successfully updated complaint")
        console.log(complaint)
    })
    .catch(err => {
        console.log("error in update")
        console.log(err)
    })
})

// ADMIN DELETE
router.delete('/admin/complaints/:id', passport.authenticate('jwt', {session: false}), utils.grantAccess('deleteAny', 'complaint'), (req,res) => {
    Complaint.findByIdAndDelete(req.params.id)
    .then((complaint) => {
        console.log("successfully deleted complaint")
        console.log(complaint)
    })
    .catch(err => {
        console.log("error in delete")
        console.log(err)
    })
})


module.exports = router;