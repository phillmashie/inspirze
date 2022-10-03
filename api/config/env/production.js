/**
 * 
 * @file        development.js
 * @description stores the environment configurations for the development environment
 * @author      Phillip Mashingaidze
 * @date        2022.06.29
 * 
 */

 module.exports = {
    // development configuration options
    /**
     * MongoDB connection URI - string URL tells MongoDB drivers how connect to database instance
     * 
     *  format:
     * mongodb://username:password@hostname:port/database
     * 
     * 
     */
    db: 'mongodb+srv://phillmashie:Phillip123@cluster0.atzlcim.mongodb.net/?retryWrites=true&w=majority',
    port: 3000
};