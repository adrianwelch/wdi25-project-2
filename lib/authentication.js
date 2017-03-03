const User = require('../models/user');

function authentication(req, res, next){
  //check to see if user logged in
  //if not exit tihs piece of middleware
  if(!req.session.isAuthenticated) return next();
// find user based on the userid in the session
  User
  .findById(req.session.userId)
  .then((user)=>{
    if(!user){
      //if the user cannot be found  log out user
      return req.session.regenerate(()=>{
        req.flash('alert', 'You must be logged in');
        return res.redirect('/login');
      });
    }
    // set user id back on the session
    req.session.userId = user.id;
// set the whole user object to the request object
//So we can use the user details in our controllers
    req.user = user;
    // set the whole user object to res.locals so we can use it in the views
    res.locals.user = user;
    // Set an isAuthenticated boolean so we can show and hide elements in the views
    res.locals.isAuthenticated = true;
    next();
  })
  .catch(next);
}
module.exports = authentication;
