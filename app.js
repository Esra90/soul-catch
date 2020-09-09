require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')



// for passport 
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User.model'); 



// Set up the database
require('./configs/db.config');

// bind user to view - locals
const bindUserToViewLocals = require('./configs/user-locals.config');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
require('./configs/session.config')(app);

app.use(bindUserToViewLocals);

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());


passport.use(new LocalStrategy(
  {
    usernameField: 'username', // by default
    passwordField: 'password'  // by default
  },
  (username, password, done) => {
    User.findOne({username})
      .then(user => {
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
 
        if (!bcrypt.compareSync(password, user.passwordHash)) {
          // req.session.currentUser = user;
          return done(null, false, { message: "Incorrect password" });
        }
 
        done(null, user);
      })
      .catch(err => done(err))
    ;
  }
));

app.engine('handlebars', expressHandlebars({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Welcome to Soul-Catch';



const index = require('./routes/index.route');
const authRouter = require('./routes/auth.route');
const eventRouter = require('./routes/event.route');
app.use('/', index);
app.use('/', authRouter);
app.use('/', eventRouter);



module.exports = app;
