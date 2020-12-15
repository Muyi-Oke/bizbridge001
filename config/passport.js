const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');   // to encrypt password string before saving or while comparing

// reference the User model
const Artisan = require('../model/artisan');


module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField: 'username'}, (username, password, done) => {
            //Match the user if it exists
            // console.log(username);

            Artisan.findOne({ username:username })
             .then(artisan => {
                if(!artisan) 
                {
                    // console.log('no artisan model returned');
                    return done(null, false, {message: 'The username is not registered'});
                }


                // user exist, then match password with hashed one
                bcrypt.compare(password, artisan.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch) {
                        // console.log('artisan model found match');
                        return done(null, artisan);
                    }
                    else
                    {
                        // console.log('artisan model found NO match for ' + artisan.password );
                        return done(null, false, {message: 'Password is incorrect'});
                    }
                });
              
            })
            .catch(err => console.log(err));
        })
    );

    //

    passport.serializeUser((Artisan, done)  => {
        done(null, Artisan.id);
      });
    
    passport.deserializeUser((id, done) => {
        Artisan.findById(id, (err, Artisan) => {
          done(err, Artisan);
        });
      });

}
