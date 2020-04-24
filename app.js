const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

const {getHomePage} = require('./routes/index');
const {addPortfolio, addPortfolioPage, DeletePortfolio, editPortfolio, editPortfolioPage} = require ('./routes/portfolio');
const {addResume, addResumePage, DeleteResume, editResume, editResumePage} =require('./routes/resume')

const PORT = process.env.PORT || 8000;



// Connect to mySQL
let connection = mysql.createConnection({
	host:'localhost',
	user:'nodeclient',
	password:'123456',
	database:'fs1030project'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.get('/', getHomePage);
app.get('/add', addPortfolioPage);
app.get('/edit/:id', editPortfolioPage);
app.get('/delete/:id', DeletePortfolio);
app.post('/add', addPortfolio);
app.post('/edit/:id', editPortfolio);


app.get('/add', addResumePage);
app.get('/edit/:id', editResumePage);
app.get('/delete/:id', DeleteResume);
app.post('/add', addResume);
app.post('/edit/:id', editResume);

const PORT = process.env.PORT || 8000;

//set the app to listen on the port
app.listen(PORT, console.log(`Server started on port ${PORT}`));