const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');   // to encrypt password string before saving or while comparing
const passport = require('passport');


// for image upload

let fs = require('fs');
let path = require('path');
let multer = require('multer');

let defaultlogoimage = '-';


// const  { ensureAuthenticated } = require('../config/auth');


const Artisan = require('../model/artisan');
// const { route } = require('.');


// MULTER FOR IMAGE UPLOAD



let storage = multer.diskStorage({
    destination: (req, file, cb) => { 
        cb(null, 'uploads'); 
    },
    filename: (req, file, cb) => {
        console.log(file);
        defaultlogoimage = file.originalname;
       cb(null, file.fieldname + '-' + Date.now());
    }
})

let upload = multer({storage:storage});

// end multer





// Welcome Page
router.get('/register', (req, res) => res.render('register'));

router.get('/login', (req, res) => res.render('login'));

//post the reegister
// router.post('/register', upload.single('image'), (req, res) => {

router.post('/register', upload.single('image'), (req, res, next) => {

  
    // console.log(req.file.filename);
    console.log(upload);

  
    if (defaultlogoimage === '-'){
        console.log('no image')
        // defaultlogoimage = (path.join('C:/Users/Rohi Harmoni/Desktop/bizbridge/public/images/no-image.png'));
        defaultlogoimage = (path.join('public/images/no-image.png'));

    }else{
        // console.log(defaultlogoimage)
        // defaultlogoimage = (path.join('C:/Users/Rohi Harmoni/Desktop/bizbridge'+'/uploads/'+ req.file.filename));
        defaultlogoimage = (path.join('uploads/'+ req.file.filename));

    }

    // console.log(req.body)
    // console.log(defaultlogoimage)

      //return


    let errors = [];

    const { cName, cNumber, cEmail, bName, industry, cacStatus, title, staffStrength, address,
        city, website, username, password, password2 } = req.body;


            //check the data supplied
        if (!cName || !cNumber || !cEmail || !bName || !industry ||
            !cacStatus || !title || !staffStrength || !address 
            || !city || !website || !username || !password || !password2){
         
                 errors.push({ msg: 'Please fill in all the fields'})
            // req.flash('error_msg', 'Please fill in all the fields');
            // res.redirect('/artisan/register');
            // console.log(errors)
        }

        //check the password and password 2 match 
        if (password !== password2){
            errors.push({ msg: 'Passwords do not match'})
            // req.flash('error_msg', 'Passwords do not match')
            // res.redirect('/artisan/register');

        }

        //check the password length to be atleast 6  xters 
        if (password.length < 6){
             errors.push({ msg: 'Passwords should be atleast 6 characters'})
            // req.flash('error_msg', 'Passwords should be atleast 6 characters');
            res.redirect('/artisan/register');

        }

        if(errors.length > 0)
        {
            res.render('register', {
                errors, cName, cNumber, cEmail, bName, industry, cacStatus, title, 
                staffStrength, address ,city ,website ,username ,password ,password2
              
            });

        }
        else
        {
      
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

                    // check for company logo, if there is none, upload no-image.png instead

                    const newArtisan = new Artisan({
                        cName, cNumber, cEmail, bName, industry, cacStatus, title, 
                        staffStrength, address ,city ,website ,username ,password,
                        upload:{
                            // data:fs.readFileSync(path.join('C:/Users/Rohi Harmoni/Desktop/bizbridge'+'/uploads/'+ req.file.filename)),
                            data:fs.readFileSync(defaultlogoimage),
                            contentType: 'image/png'

                           

                        } 
                    });

                 

                 // Lets encrypt or hash the password
                    bcrypt.genSalt(10, (err,salt) => 
                      bcrypt.hash(newArtisan.password, salt, (err, hash) => {
                        if(err) throw err;
                        // set password to the hashed one not the plain text
                        newArtisan.password = hash;
                                          
                        // save new User
                        newArtisan.save()
                            .then(artisann => {
                                defaultlogoimage = '-';
                                // call afunction to delete the uploaded image
                                DeleteFile('uploads/'+ req.file.filename);

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


const DeleteFile = (iPath) => {
  
    console.log(iPath);

        var filename = iPath;
        var tempFile = fs.openSync(filename, 'r');
        // try commenting out the following line to see the different behavior
        fs.closeSync(tempFile);
        fs.unlinkSync(filename);
     return  
  }

module.exports = router;