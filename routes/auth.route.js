////////////////////////
const { Router } = require('express');
const mongoose = require('mongoose');
const User = require('../models/User.model');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const passport = require('passport');
const Event = require('../models/Event.model');

const multer = require('multer');
const upload = multer({ dest: './public/uploads' });

const routeGuard = require('../configs/route-guard.config');


// GET route to display a sign up page
router.get('/signup', (_, res) => {
    res.render('auth/signup')
} )


//POST - Create an user 
router.post('/signup', upload.single('profilePicture'), (req, res, next) => {
    // console.log('The form data: ', req.body);
     const { username, email, password, genre} = req.body;
     console.log(req.body);

      //Check if all fields are filled when create a account
      if (!username || !email || !password){
        res.render('auth/signup' , { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
        return;
    }

     const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
     if (!regex.test(password)) {
       res
         .status(500)
         .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
       return;
     }
     
    
     bcryptjs
     .genSalt(saltRounds)
     .then(salt => bcryptjs.hash(password, salt))
     .then(hashedPassword => {
         return User.create({
             username,
             email,
             genre,
             profilePicture: req.file.filename,
             passwordHash : hashedPassword
         });
        //  console.log(`Password hash: ${hashedPassword}`);
     })
     .then(userFromDB => {
         console.log('Newly created user is:', userFromDB);
         req.session.currentUser = userFromDB;
         res.redirect('/login');
     })
     .catch(error => {

         if (error instanceof mongoose.Error.ValidationError){
             res.status(500).render('auth/signup', {errorMessage: error.message});
         }
         else if (error.code === 11000) {
             res.status(500).render('auth/signup', {
             errorMessage: 'Username and email need to be unique. Either username or email is already used.'
            });
          }
          else {
             next(error);
          }
     });
  });
   


// GET - login page 
router.get('/login', (req, res ) => {
    // console.log('SESSION =====> ', req.session);
    res.render('auth/login');
})

// POST -login page
router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    passport.authenticate('local', (err, user, failureDetails) => {
      if (err) {
        // Something went wrong authenticating user
        return next(err);
      }
   
      if (!user) {
        // Unauthorized, `failureDetails` contains the error messages from our logic in "LocalStrategy" {message: '…'}.
        res.render('auth/login', { errorMessage: 'Wrong password or username' });
        return;
      }
   
      // save user in session: req.user
      req.login(user, (err) => {
        console.log(user);
        if (err) {
          // Session save went bad
          return next(err);
        }
   
        // All good, we are now logged in and `req.user` is now set
        req.session.currentUser = user;
        res.redirect('/userProfile');
      });
    })(req, res, next);
  });


  // GET - User profile

  // router.get('/userProfile', (req, res) => {
  
  //   res.render('userProfile');
  // })

  router.get('/userProfile',  (req, res) => {
    if (!req.session.currentUser) {
      res.redirect('/login'); // not logged-in
      return;
    }
  
  Event.find()
  .then ((allEvents) => {
    // console.log(allReviews)
    const newArr = []
    
    allEvents.forEach(elem => {
      if(elem.user && elem.user[0] == req.session.currentUser["_id"]){
       newArr.push(elem)
      } 
    })
     console.log(newArr)
     res.render('userProfile', {userInSession: req.session.currentUser, review: newArr})
  }
  )
  .catch(
    error => console.log(`Error while getting a event for edit: ${error}`)
  )
  });


  // GET -Logout
router.get('/logout', (req, res) => {
    res.render('auth/logout')
  })

 //POST - Logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
  });

module.exports = router;

