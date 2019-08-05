const express = require('express');
const router = express.Router();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


//requiring keys
const  keys = require('../../config/keys');
// Load User model
const db = require('../../models/User');

//cookie setup
passport.serializeUser(function(user, done){
  done(null, user.user_id);
});
passport.deserializeUser(function(id, done){
  db.query("select * from google_users where id = "+  user.user_id, function (err, rows){
      done(err, rows[0]);
  });
});


//passport config
passport.use(new GoogleStrategy({ 
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: "http://localhost:3000/api/user/google/redirect"
  },
  (accessToken, refreshToken, profile, done) => {
    const newUser = {
      "first_name": profile._json.given_name,
      "last_name": profile._json.family_name || profile._json.given_name,
      "email": profile.emails[0].value,
      "google_id": profile.id, 
      "avatar": profile._json.picture
    }
    db.query(`SELECT * FROM google_users WHERE email = '${newUser.email}'`, (err, rows, fields) => {
        if(err) throw err;
        if(rows.length > 0){
            console.log(`${newUser.email} already exist BTW welcome back`);
            return done(null, rows[0]);
            
        }
        else{
            db.query(`INSERT INTO google_users SET ?`, newUser, (err, rows, fields) =>{
                if(err) throw err;
                return done(null, rows[0]);
            })
        }
    })
  }
  ));

//get user detail via google api
router.get('/auth', passport.authenticate('google', {scope: ['profile', 'email']}));    

//google redirect uri   
router.get('/redirect', passport.authenticate('google', { failureRedirect: '/api/user/google/error' }),
(req, res) => {
res.send(req.user);
});

//if there is some failure => Redirect
router.get('/error', (req, res) => {
  res.send(`probably there is some problem with google auhentication`);
})

//logout user
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})





module.exports = router;