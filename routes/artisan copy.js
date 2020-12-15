const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');   // to encrypt password string before saving or while comparing
const passport = require('passport');


// for image upload

// let fs = require('fs');
// let path = require('path');
// let multer = require('multer');




// const  { ensureAuthenticated } = require('../config/auth');


const Artisan = require('../model/artisan');
// const { route } = require('.');


// MULTER FOR IMAGE UPLOAD

// let storage = multer.diskStorage({
//     destination: (req, file, cb) => { 
//         cb(null, 'uploads'); 
//     },
//     filename: (req, file, cb) => {
//         console.log(file);
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// })

// let upload = multer({storage:storage});

// // end multer



// Welcome Page
router.get('/register', (req, res) => res.render('register'));

router.get('/login', (req, res) => res.render('login'));

//post the reegister
// router.post('/register', upload.single('image'), (req, res) => {

router.post('/register', (req, res) => {

    // console.log('stage 1');

    //  console.log(req.body)

    let errors = [];

    const { cName, cNumber, cEmail, bName, industry, cacStatus, title, staffStrength, address,
        city, website, username, password, password2 } = req.body;

       console.log(req.body)

            //check the data supplied
        if (!cName || !cNumber || !cEmail || !bName || !industry ||
            !cacStatus || !title || !staffStrength || !address 
            || !city || !website || !username || !password || !password2){
         
                // errors.push({ msg: 'Please fill in all the fields'})
            req.flash('error_msg', 'Please fill in all the fields');
            res.redirect('/artisan/register');
            // console.log(errors)
        }

        if (!cacStatus ){
                // errors.push({ msg: 'Please fill in all the fields'})
            req.flash('error_msg', 'Please choose if your company is registered with CAC');
            res.redirect('/artisan/register');
            // console.log(errors)
        }

        //check the password and password 2 match 
        if (password !== password2){
            // errors.push({ msg: 'Passwords do not match'})
            req.flash('error_msg', 'Passwords do not match')
            res.redirect('/artisan/register');

        }

        //check the password length to be atleast 6  xters 
        if (password.length < 6){
            // errors.push({ msg: 'Passwords should be atleast 6 characters'})
            req.flash('error_msg', 'Passwords should be atleast 6 characters');
            res.redirect('/artisan/register');

        }

        if(errors.length > 0)
        {
            res.render('register', {
                errors, cName, cNumber, cEmail, bName, industry, cacStatus, title, 
                staffStrength, address ,city ,website ,username ,password ,password2
              
            });
            console.log('error wa oooh');

        }
        else
        {
            // res.send('pass')
            // validation of password

            console.log('about to search');

            Artisan.findOne({ username: username})
            .then(artisan => {
                if(artisan){
                    // user exists
                    errors.push({msg: 'Username is already registered'});
                    res.render('register', {
                        errors, cName, cNumber, cEmail, bName, industry, cacStatus, title, 
                        staffStrength, address ,city ,website ,username ,password ,password2
                    });
                }
                else
                {
                    console.log('create new artisan');

                    // const newArtisan = new Artisan({
                    //     cName, cNumber, cEmail, bName, industry, cacStatus, title, 
                    //     staffStrength, address ,city ,website ,username ,password,
                    //     upload:{
                    //         data:fs.readFileSync(path.join('C:/Users/Rohi Harmoni/Desktop/bizbridge'+'/uploads/'+ req.file.filename)),
                    //         contentType: 'image/png'
                    //     } 
                    // });

                    const newArtisan = new Artisan({
                        cName, cNumber, cEmail, bName, industry, cacStatus, title, 
                        staffStrength, address ,city ,website ,username ,password
                   });
    
                    console.log('create new artisan2');

                 // Lets encrypt or hash the password
                    bcrypt.genSalt(10, (err,salt) => 
                      bcrypt.hash(newArtisan.password, salt, (err, hash) => {
                        if(err) throw err;
                        // set password to the hashed one not the plain text
                        newArtisan.password = hash;
                        
                        console.log(newArtisan);

                        // save new User
                        newArtisan.save()
                            .then(Artisan => {
                                req.flash('success_msg', 'You are now successfully registered and can log in')
                                res.redirect('/artisan/login');
                            })
                            .catch(err => console.log(err));
                    }))
    
                }
                });  

                
            };
    
});



//Login hanldes

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
     successRedirect: '/dashboard',
     failureRedirect: '/artisan/login',
     failureFlash: true

 })(req, res, next);  //this is very important for passport authenticate to work
//console.log('I am here');

});


router.get('/logout', (req, res) =>{
   req.logout;
    req.session.destroy();
    req.session = null;
   //req.flash('success_msg', 'You are successfully logged out');
   res.redirect('/artisan/login');
});


module.exports = router;