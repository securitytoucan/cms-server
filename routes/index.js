const router = require('express').Router();
const User = require('../models/user');
const utils = require('../lib/utils');

// LOGIN
router.post('/login', function(req,res,next) {
    User.findOne({username: req.body.username})
    .then((user) => {
        
        if(!user) {
            res.status(401).json({success: false, msg: "could not find user"})
        }

        const isValid = utils.validPassword(req.body.password, user.hash, user.salt);

        if (isValid) {
            const tokenObj = utils.issueJWT(user);

            // res.status(200).json({success: true, token: tokenObj, expires: tokenObj.expires, user: user, type: 'user'})
            res.status(200).json({success: true, token: tokenObj, expires: tokenObj.expires, type: 'user'})
        } else {
            res.status(401).json({success: false, msg: "you entered the wrong password"})
        }
    });
});


// REGISTER
router.post('/register', function(req,res,next) {
    const saltHash = utils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt
    });

    newUser.save()
    .then((user) => {
        res.status(200).json({success: true, msg: "successfully created user"})
    })
    .catch(err => next(err));
});





module.exports = router;