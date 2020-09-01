////////////////////////
const mongoose = require('mongoose');
const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');

const multer = require('multer');
const upload = multer({ dest: './public/uploads' });


const routeGuard = require('../configs/route-guard.config');

router.get('/signup', (_, res) => {
    res.render('auth/signup')
} )

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
   


router.get('/login', (req, res ) => {
    console.log('SESSION =====> ', req.session);
    res.render('auth/login');
})


router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        res.render('auth/login', {errorMessage: 'All fields are required.'});
        return;
    }

    User.findOne({email})
        .then(userFromDB =>{
            if (!userFromDB) {
                res.render('auth/login', {errorMessage: 'Incorrect email entered.'});
                return;
            } else if (bcryptjs.compareSync(password, userFromDB.passwordHash)) {
                req.session.currentUser = userFromDB;
                res.redirect('userProfile');
            } else {
                res.render('auth/login', {errorMessage: 'Incorrect password entered.'})
            }
        })
})

// router.get('/userProfile', routeGuard, (req, res) => {
//   res.render('users/userProfile');
// });

router.get('/userProfile', (req, res) => {
  res.render('users/userProfile', { userInSession: req.session.currentUser });
});




module.exports = router;

