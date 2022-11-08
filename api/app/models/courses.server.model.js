/**
 * 
 * @file        courses.server.model.js
 * @description this model describes course information (course code, course name, section, lecture)
 * @author      Phillip Mashingaidze
 * @date        2022.06.29
 * 
 */

 const mongoose = require('mongoose');

 // create a model class
 let coursesSchema = mongoose.Schema({
     courseCode: {
         type: String,
         unique: true,
     },
     title: {
        type: String,
        required: true
      },
      subtitle: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: false,
        default: 0
      },
      section: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Sections'
    }],  
     students: [
         {
             type: mongoose.Schema.ObjectId,
             ref: 'Students'
         }
     ]
    },
    { timestamps: true }
 );
 
 module.exports = mongoose.model('Courses', coursesSchema);