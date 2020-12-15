const express = require('express');
const router = express.Router();

const  { ensureAuthenticated } = require('../config/auth');
const Artisan = require('../model/artisan');

// Welcome Page
router.get('/', (req, res) => res.render('index'));

router.get('/pricing', (req, res) => res.render('pricing'));

router.get('/search', (req, res) => res.render('searchresult'));

router.get('/viewall', (req, res) => res.render('viewall'));




// router.get('/dashboard', (req, res) =>
//  res.render('dashboard', {name: req.user.cName}
//  ));


//dashboard page
router.get('/dashboard', ensureAuthenticated, (req, res) => 
  res.render('dashboard', {
      name: req.user.cName}));


router.post('/', (req, res) => {
  // console.log(req.body);
  // res.send('sent');

  let jQuery = "";

  let what = req.body.what;
  let where = req.body.where;

  if (where == 'option' || !where){
    jQuery = {industry:what};
    where = 'all registered locations'
  }else {
    jQuery = {industry:what, city:where};
  }
   
  // Artisan.find({industry:what, city:where}, (err, result) => {
    Artisan.find(jQuery, (err, result) => {
    if (err) {
       console.log(err);
       res.send('Error Occurs' + jQuery);
      //  req.flash('error_msg', 'Error Occur while retrieving records...');
    } else {
      res.render('searchresult', {record:result, what:what, where:where});
    }
  });



});


// //dashboard page
// router.get('/dashboard', ensureAuthenticated, (req, res) => 
//   res.render('dashboard', {
//       name: req.user.name,
//       pageTitle:'Dashboard'}));

//       // user list call
// router.get('/userlist', ensureAuthenticated, (req, res) => 

//           User.find(function(err, result){
//             if(err){
//                 console.log(err)
//             }else {
//                 //res.render('patientlist', {record:result});
//                 res.render('userlist', {
//                     name: req.user.name, 
//                     record:result,
//                     pageTitle:'User Registration List'});
            
//             }
//           })


      
//           );




module.exports = router;