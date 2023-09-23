const express = require('express');
const mongoose = require('mongoose');
const DBURI = require('./config/database_string');
const csrf = require('csurf');
const expressSession = require('express-session');
const methodOveride = require('method-override');
const expresslayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');
const connectMongo = require('connect-mongo'); // pls use version 3 ie npm i connect-mongo@3
const app = express();


const port = process.env.PORT||8080;

const routes = require('./routers/blog-routes');
// const { urlencoded } = require('express');
// express layout
app.use(expresslayout);
app.set('layout', './layouts/main-layout');
app.set('view engine','ejs');


mongoose.connect(DBURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
  app.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
})


.catch((err)=>{
  console.log(err)
})
//use express.urlencoded to grab form values
app.use(express.urlencoded({extended:true}));
//use cookie parser
app.use(cookieParser('dolomite'));


// create MongoStore
const MongoStore = connectMongo(expressSession);

//use express-session
app.use(expressSession({
  secret: 'put your own secret',
  resave: false,
  saveUninitialized: true,
  maxAge: 86400000,
  // use mongoStore
  store: new MongoStore({mongooseConnection: mongoose.connection})
  // cookie: { secure: true }
}));


//use csrf
app.use(csrf());

//use passport
app.use(passport.initialize());
app.use(passport.session());
//use connect flash
app.use(flash());

app.use(function(req, res, next){
  res.locals.error = req.flash('error');
  next();
})
//use method overide
app.use(methodOveride('_method'));


//use public folder
app.use(express.static('public'));
app.use(express.static('uploads'));

//use blog routes
app.use(routes);

//render 404 page
app.use((req,res)=>{
    res.status(404).render('404', {title: 'error-page', csrfToken: req.csrfToken()})
})
