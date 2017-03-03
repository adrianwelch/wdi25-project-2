//1. require our packages
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird'); //setting bluebird to be the promise library for mongoose
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const { port, env, dbURI, sessionSecret} = require('./config/environment');
const errorHandler = require('./lib/errorHandler');
const routes = require('./config/routes');
const customResponses = require('./lib/customResponses');
const authentication = require('./lib/authentication');



// create an express app
const app = express();

//set up our template engine
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(expressLayouts);

// set up our static files folder
app.use(express.static(`${__dirname}/public`)); //looks in public folder first when request otherwise routes

// made config folder and enviornment.js
// connect to our database
mongoose.connect(dbURI);

//set up middeware
if(env !== 'test') app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride((req) => {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method; // makes sure wedont accidently store it in the database

    return method;
  }
}));

//set up our sessionSecret
app.use(session({
  secret: sessionSecret || 'super secret',
  resave: false,
  saveUninitialized: false
}));

//set up flash messages after sessionSecret
app.use(flash()); //flash messages require the session which is why its put under the code

// set up custom middleware
app.use(customResponses);
app.use(authentication);

// set up our routes - just before our error handler
app.use(routes);

//set up our error handler - always the last piece of middleware before app.listen
app.use(errorHandler);

app.listen(port, () => console.log(`Express is listening to port ${port}`));
