/**
 * 
 * @file        express.js
 * @description this file initializes and configures the express application
 * @author      Phillip Mashingaidze
 * @date        2022.06.29
 * 
 */

// load the module dependencies----------------------------------------------------------------------------------------------

// built-in node modules

// installed node modules
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require("body-parser");
//  2022.06.29 - 00:15:19 - added passport
const passport = require('passport');


// custom modules
// const config = require('./config');

// define the routes
const studentRoutes = require('../app/routes/students.server.routes');
const courseRoutes = require('../app/routes/courses.server.routes');


// create a new express app
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type, Authorization");
    next();
});
// configure the session middleware ------------------------------------------------------------------------------------------
app.use(session({secret: 'inspirze',saveUninitialized: true,resave: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//  2022.06.29 - 00:14:41- added passport
app.use(passport.initialize()); //bootstrapping the Passport module
app.use(passport.session()); //keep track of your user's session

// load the routing files
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);


// export the express application instance
module.exports = app;