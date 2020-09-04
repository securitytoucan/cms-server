const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const { roles } = require('./roles');

const PRIV_KEY = fs.readFileSync('../keys/id_rsa_priv.pem', 'utf8');
// __dirname+'/../keys/id_rsa_priv.pem


// * @param {*} password - The plain text password
// * @param {*} hash - The hash stored in the database
// * @param {*} salt - The salt stored in the database

// This function uses the crypto library to decrypt the hash using the salt and then compares
// the decrypted hash/salt with the password that the user provided at login
function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

// This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
// password in the database, the salt and hash are stored for security
function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hash: genHash
    };
}

// THIS IS WHAT THE PAYLOAD LOOKS LIKE
// const payloadObj = {
//     sub: '1234567890', // sub is the database id unique to this payload object/jwt
//     name: 'John Doe',
//     role: 'admin' (or 'basic'),
//     iat: 1516239022
// }

// ISSUE JWT
function issueJWT(user) {
    const _id = user._id;
    const role = user.role;
  
    const expiresIn = '1d';
  
    const payload = {
      sub: _id,
      role: role,
      iat: Date.now()
    };
  
    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
  
    return {
    // Bearer <token>
      token: "Bearer " + signedToken,
      expires: expiresIn
    }
  }


// ==============
// AUTHORIZATION
// ==============
function grantAccess (action, resource) {
  return async (req, res, next) => {
   try {
    const permission = roles.can(req.user.role)[action](resource);
    if (!permission.granted) {
     return res.status(401).json({
      error: "You don't have enough permission to perform this action"
     });
    }
    next()
   } catch (error) {
    next(error)
   }
  }
 }
  
// async function allowIfLoggedin (req, res, next) {
//   try {
//    const user = res.locals.loggedInUser;
//    if (!user)
//     return res.status(401).json({
//      error: "You need to be logged in to access this route"
//     });
//     req.user = user;
//     next();
//    } catch (error) {
//     next(error);
//    }
//  }


  
  module.exports.validPassword = validPassword;
  module.exports.genPassword = genPassword;
  module.exports.issueJWT = issueJWT;
  module.exports.grantAccess = grantAccess;
  // module.exports.allowIfLoggedin = allowIfLoggedin;