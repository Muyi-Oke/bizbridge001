const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');   // to encrypt password string before saving or while comparing

// reference the User model
const User = require('../models/User');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            //Match the user if it exists
            User.findOne({ email:email })
            .then(user => {
                if(!user) 
                {
                    return done(null, false, {message: 'The email is not registered'});
                }

                // user exist, then match password with hashed one
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch) {
                        return done(null, user);
                    }
                    else
                    {
                        return done(null, false, {message: 'Password is incorrect'});
                    }
                });
              
            })
            .catch(err => console.log(err));
        })
    );

    //

    passport.serializeUser((user, done)  => {
        done(null, user.id);
      });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });

}
