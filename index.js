require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const helmet = require('helmet');
const isLoggedIn = require('./middleware/isLoggedIn');
const session = require('express-session');
const app = express();
const passport = require('./config/ppConfig');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(ejsLayouts);
app.use(helmet());

const sessionStore = new SequelizeStore({
  db: db.sequelize,
  expiration: 1000 * 60 * 30
});

//Use this line once to set up the store table
sessionStore.sync();

//Session must come before flash and passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

// Must come after session and after passport middleware 
app.use(flash());

//These two lines must come after we set up the session
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3001, () => console.log(`🎧 You're listening to Port 3001🎧`));

module.exports = server;
