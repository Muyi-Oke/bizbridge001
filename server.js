const express = require('express'),
   ejs = require('ejs'),
   mongoose = require('mongoose'),
   bodyParser = require('body-parser'),
   app = express();

   const flash = require('connect-flash');
   const session = require('express-session');
   const passport = require('passport');


 // Passport COnfig
 require('./config/passport')(passport);

   
 // DB COnfig
 const db = require('./config/keys').uri;

 mongoose.connect(db, {useNewUrlParser:true, useUnifiedTopology:true})
  .then(() => console.log('MongoDB Connected Successfully..'))
  .catch(err => console.log(err));
 

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(express.static('public'));

//express session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);



  // passport Middleware for serialized and deserialized needs these lines
  app.use(passport.initialize());
  app.use(passport.session());


// Connect flash
app.use(flash());

  // Global Variables Middleware
  app.use((req, res, next) => {
    res.locals.success_msg =  req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    name = "";
    logofilename = "";
    next();
  });


app.set('view engine', 'ejs')


// app.get('/', (req, res) => {
//     res.render('index');
// })

// app.get('/register', (req, res) => {
//     res.render('register');
// })

// app.get('/login', (req, res) => {
//     res.render('login');
// })

 //Routes
 app.use('/', require('./routes/index'));
 app.use('/artisan', require('./routes/artisan'));



// Setup server port
const PORT = process.env.PORT || 4040;

// listen for requests
app.listen(PORT,  console.log(`Server is listening on port ${PORT}`));
