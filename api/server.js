/**
 * 
 * @file        server.js
 * @description application manifest
 * @author      Phillip Mashingaidze
 * @date        2022.06.29
 * 
 */

// often, the NODE_ENV environment variable is not properly set
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// NOTE: must load Mongoose config before any other configurations, this is to let the other moduels be able to use the Mongoose models without loading them themselves; remember that JavaScript loads all vars into one global namespace, that was the reason node.js had to solve it via CommonJS modules
const config = require('./config/config');
const db = require('./config/mongoose');
const app = require('./config/express');
//  2022.06.29 - 00:15:29 added Passport

const passport = require('./config/passport');

app.listen(config.port, () => {
    console.log(`Inspirze Server running at http://localhost:${config.port}/`);
});
module.exports = app;

