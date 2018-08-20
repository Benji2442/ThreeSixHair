const express               = require('express'),
      passportLocalMongoose = require('passport-local-mongoose'),
      methodOverride        = require('method-override'),
      LocalStrategy         = require('passport-local'),
      bodyParser            = require('body-parser'),
      passport              = require('passport'),
      mongoose              = require('mongoose'),
      nodemailer            = require('nodemailer'),
      request               = require('request'),
      app                   = express();

//===============================================
// MODELS & ROUTES
//===============================================

const Treatment      = require('./models/treatment.js');
const User           = require('./models/user.js');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');

//===============================================
// CONFIG
//===============================================

require('dotenv').config();
app.use(express.static(__dirname + '/public'));
mongoose.connect('mongodb://' + process.env.MONGODB_URI);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//===============================================
// PASSPORT CONFIG
//===============================================

app.use(require('express-session')({
    secret: process.env.EXPRESS_SECRET,
    resave: false,
    saveUninitialized: false,
  }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===============================================
// ROUTES
//===============================================

app.use(adminRoutes);
app.use(authRoutes);
app.use(publicRoutes);

app.listen(process.env.PORT || 3000, () => console.log('36hair Server started'));
