const router = require('express').Router();
const Admin = require('../models/admin');
const utils = require('../lib/utils');


// LOGIN
router.post('/admin/login', (req,res) => {
    Admin.findOne({username: req.body.username})
    .then((admin) => {
        if(!admin) {
            res.status(401).json({success: false, msg: "could not find admin"})
        }

        const isValid = utils.validPassword(req.body.password, admin.hash, admin.salt);

        if (isValid) {
            const tokenObj = utils.issueJWT(admin);

            // res.status(200).json({success: true, token: tokenObj, expires: tokenObj.expires, admin: admin, type: 'administrator'})
            res.status(200).json({success: true, token: tokenObj, expires: tokenObj.expires, type: 'administrator'})
        } else {
            res.status(401).json({success: false, msg: "you entered the wrong password"})
        }
    })
    .catch(err => {
        res.status(404).json({success: false, msg: "could not find admin"})
    });
});

// REGISTER
// should  not be able to access from client-side
router.post('/admin/register', (req,res) => {
    const saltHash = utils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newAdmin = new Admin({
        username: req.body.username,
        hash: hash,
        salt: salt
    });

    newAdmin.save()
    .then((admin) => {
        // res.status(200).json({success: true, admin: admin});
        res.status(200).json({success: true, msg: "successfully created admin"});

        // const jwt = utils.issueJWT(admin);
        // res.status(200).json({success: true, user: user, expiresIn: jwt.expires, token: jwt, type: 'administrator'});
    })
    .catch(err => {
        next(err);
    })
});


module.exports = router;