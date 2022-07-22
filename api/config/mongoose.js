/**
 * 
 * @file        mongoose.js
 * @description this file configures mongoose and registers our different models
 * @author      Phillip Mashingaidze
 * @date        2022.06.29
 * 
 */

 const config = require("./config");
 const mongoose = require("mongoose");
 
 mongoose.connect(config.db);
 const mongoDB = mongoose.connection;
 // 2022.06.29 - 02:14:22 - adding the default admin user when API first starts
 const Student = require('../app/models/students.server.model');
 
 mongoDB.on('error', console.error.bind(console, 'connection error:'));
 mongoDB.once('open', () => {
     // 2022.06.29 - 02:16:35 - instead of using findOneAndUpdate, switched to findOne then save because findoneandupdate with upsert:true was not triggering the pre middleware
     if (Student.findOne({ studentNumber: 1 },
         // callback
         (err, res) => {
             if (!res) {
                 let admin = Student({
                     studentNumber: 1,
                     password: 'password',
                     firstName: 'admin',
                     lastName: 'user',
                     role: 'admin',
                     // 2022.06.29 - 08:03:12 - provider is mandatory for passport
                     provider: 'local'
                 })
 
                 admin.save(err => {
                     if (err) {
                         console.log(`unable to insert admin into ${config.db}`);
                         console.log(err);
                     } else {
                         console.log(`admin user (#1) inserted into ${config.db}`);
                     }
                 });
             } else {
                 console.log(`admin user (#1) already exists in ${config.db}`);
             }
         })) {
 
     }
     console.log(`Connected to MongoDB at ${config.db}`);
 });
 
 module.exports = mongoDB;