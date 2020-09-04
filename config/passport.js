// ================
// PASSPORT CONFIG
// ================
const fs = require('fs');
const User = require('../models/user');
const Admin = require('../models/admin');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const PUB_KEY = fs.readFileSync(__dirname+'/../keys/id_rsa_pub.pem', 'utf8');

// verification step options - that's why PUB_KEY instead of PRIV_KEY
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

// THIS IS WHAT THE PAYLOAD LOOKS LIKE
// const payloadObj = {
//     sub: '1234567890', // sub is the database id unique to this payload object/jwt
//     name: 'John Doe',
//     role: 'admin' (or 'basic'),
//     iat: 1516239022
// }

// remember! this is VERIFICATION only - no issuance
const strategy = new JwtStrategy(options, (payload, done) => {
    // use admin db
    if (payload.role === 'admin') {
        Admin.findOne({_id: payload.sub})
        .then((admin) => {
            if (admin) {
                return done(null, admin);
            } else {
                return done(null, false)
            }
        })
        .catch(err => done(null, false))
    } else {
        // use user db
        User.findOne({_id: payload.sub})
        .then((user) => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false)
            }
        })
        .catch(err => done(err, null));
    }
    
})

// called at every passport.authenticate
// it's a call back
module.exports = (passport) => {
    passport.use(strategy)
}