const AccessControl = require('accesscontrol');
const ac = new AccessControl();
 
module.exports.roles = (function() {
ac.grant('basic')
 .createOwn('complaint')
 .readOwn('complaints')
//  .updateOwn('profile')
 .updateOwn('complaint')
 .deleteOwn('complaint')
 
 
ac.grant('admin')
 .extend('basic')
 .readAny('complaints')
 .updateAny('complaint')
 .deleteAny('complaint')


return ac;
})();