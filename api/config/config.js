/**
 * 
 * @file        config.js
 * @description this file simply loads the correct configuration file according to the process.env.NODE_ENV environment variable.
 * @author      Phillip Mashingaidze
 * @date        2022.06.29
 * 
 */

 module.exports = require('./env/' + process.env.NODE_ENV + '.js');