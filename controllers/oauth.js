const rp = require('request-promise');
// const config = require('../config/oauth');
const User = require('../models/user');
const oauth = require('../config/oauth');


function github(req, res, next) {
  return rp({
    method: 'POST',
    url: oauth.github.accessTokenURL,
    qs: {
      client_id: oauth.github.clientId,
      client_secret: oauth.github.clientSecret,
      code: req.query.code
    },
    json: true
  })
  .then((token) => {
    return rp({
      method: 'GET',
      url: oauth.github.profileURL,
      qs: token,
      json: true,
      headers: {
        'User-Agent': 'Request-Promise'
      }
    });
  })
  .then((profile) => {
    return User
      .findOne({ $or: [{ email: profile.email }, { githubId: profile.id }] })
      .then((user) => {
        if(!user) {
          user = new User({
            username: profile.login,
            email: profile.email
          });
        }

        user.githubId = profile.id;
        user.image = profile.avatar_url;
        return user.save();
      });
  })
  .then((user) => {
    req.session.userId = user.id;
    req.session.isAuthenticated = true;

    req.flash('info', `Welcome back, ${user.username}!`);
    res.redirect('/dives');
  })
  .catch(next);
}


function facebook(req, res, next) {
  console.log(req.query);
  return rp({
    method: 'GET',
    url: oauth.facebook.accessTokenURL,
    qs: {
      client_id: oauth.facebook.clientId,
      redirect_uri: 'http://localhost:3000/oauth/facebook',
      client_secret: oauth.facebook.clientSecret,
      code: req.query.code
    },
    json: true
  })

 .then((token) => {

   return rp.get({
     url: 'https://graph.facebook.com/v2.5/me?fields=id,name,email,picture.height(961)',
     qs: token,
     redirect_uri: 'http://localhost:3000/oauth/facebook',
     json: true
   });
 })
 .then((profile) => {
   console.log(profile);
   return User.findOne({ email: profile.email })
     .then((user) => {
       if(!user) {
         user = new User({
           username: profile.name,
           email: profile.email
         });
       }

       user.facebookId = profile.id;
       user.image = profile.picture.data.url;
       return user.save();
     });
 })
 .then((user) => {
   req.session.userId = user.id;
   req.session.isAuthenticated = true;

   req.flash('info', `Welcome Back ${user.username}!`);
   res.redirect('/dives');
 })
 .catch(next);
}

module.exports = { github, facebook };
