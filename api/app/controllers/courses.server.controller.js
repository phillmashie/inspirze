/**
 * 
 * @file        courses.server.controller.js
 * @description this controller handles the CRUD operations for a Course Entity
 * @author      Phillip Mashingaidze
 * @date        2022.07.26 15:00PM
 * 
 */
 const mongoose = require('mongoose');

 // student object created from the Schema / model
 const Student = require('../models/students.server.model');
 const Lecture = require('../models/lecture.server.model');
 const Course = require('../models/courses.server.model');
 
 // Course CRUD FUNCTIONS =======================================================
 
 // Get list of courses
 module.exports.GetCourses = function (req, res, next) {
    const courseId = req.params.courseId;
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.currentpage;   
    const courseQuery = Course.find();
    if (pageSize && currentPage) {
        courseQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);

    }
    Course.find({courses: { $ne: courseId }},(err, courses) => {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            console.log(res);
            res.status(200).json(courses);
        }
    });
 }
 
 // add course
 module.exports.CreateCourse = function (req, res, next) {
     let course = Course(req.body);
     console.log('somebody is trying to add a course now!');
     console.log(course);
     course.save(err => {
         if (err) {
            console.log(err);
             return res.status(400).send({
                 message: getErrorMessage(err)
             });
         } else {
             res.status(200).json(course);
         }
     })
 }
 
 module.exports.DeleteCourse = function (req, res, next) {
     const courseId = req.params.id;
 
     Course.findById(courseId,
         (err, course) => {
             if (err) {
                 return res.status(400).send({
                     message: getErrorMessage(err)
                 });
             } else {
                 // 1. drop THIS course from EVERY student enrolled in this course
                 console.log('Here are all the students in course: ' + course.courseCode);
                 course.students.forEach(studentId => {
                     console.log(studentId);
                     Student.findById(studentId,
                         (err, student) => {
                             console.log(student.studentNumber);
                         });
                     Student.findByIdAndUpdate(studentId,
                         { $pull: { courses: courseId } },
                         { new: true },
                         (err, updatedStudent) => {
                             if (err) {
                                 return res.status(400).send({
                                     message: getErrorMessage(err)
                                 });
                             } else {
                                 console.log(`Successfully dropped course (${course.courseCode}) from student (#${updatedStudent.studentNumber}) ...`);
                             }
                         });
                 });
             }
         });
 
     // 2. drop EACH student enrolled in this course FROM this course
     // Actually, don't need to do this step...since students have been dropped from this course already, no more "relation" can simply delete this course...
 
     // 3. delete THIS course
     Course.remove({ _id: courseId }, (err) => {
         if (err) {
            console.log(err);
             return res.status(400).send({
                 message: getErrorMessage(err)
             });
         } else {
             console.log(`Successfully deleted this course`);
             return res.status(200).json(courseId);
         }
     });
 }
 
 module.exports.GetOneCourse = function (req, res, next) {
     let id = req.params.id;
     const pageSize = +req.query.pagesize;
     const currentPage = +req.query.currentpage;
     const courseQuery = Course.findOne;
     if (pageSize && currentPage) {
         courseQuery
         .skip(pageSize * (currentPage - 1))
         .limit(pageSize);
 
     }
 
     Course.findOne({ _id: id })
         .populate('students')
         .exec((err, course) => {
             res.json(course);
         })
 }
 
 module.exports.UpdateCourse = function (req, res, next) {
 
     Course.findByIdAndUpdate(req.body._id, req.body, (err, c) => {
         if (err) {
             return res.status(400).send({
                 message: getErrorMessage(err)
             })
         } else {
             res.json(c);
         }
     })
 }
 
 // 2022.06.29 - 11:30:32
 module.exports.GetEnrolledCourses = function (req, res, next) {
     const studentId = req.params.studentId;
 
     Course.find({ students: {$in:studentId} },
         (err, c) => {
             if (err) {
                 return res.status(400).send({
                     message: getErrorMessage(err)
                 });
                 
             } else {
                console.log(c);
                 res.status(200).json(c);
             }
         }
     );
 }
 
 // 2022.06.29 - 11:30:32
 module.exports.GetAvailableCourses = function (req, res, next) {
     const studentId = req.params.studentId;
 
     Course.find({ students: { $ne: studentId } },
         (err, c) => {
             if (err) {
                 return res.status(400).send({
                     message: getErrorMessage(err)
                 });
             } else {
                 res.status(200).json(c);
             }
         }
     );
 }
 
 // 2022.06.29 - 11:30:32
 module.exports.GetNotEnrolledStudents = function (req, res, next) {
     const courseId = req.params.courseId;
 
     Student.find({ courses: { $ne: courseId }, studentNumber: { $ne: 1 } },
         (err, s) => {
             if (err) return res.status(400).send({
                 message: getErrorMessage(err)
             });
             else return res.status(200).json(s);
         }
     );
 }
 
 function getErrorMessage(err) {
     let message = '';
     if (err.code) {
         switch (err.code) {
             case 11000:
             case 11001:
                 message = 'Course code already exists';
                 break;
             default:
                 message = 'Something went wrong';
         }
     } else {
         // mongoose validation error
         if (err.errors) {
             for (let errName in err.errors) {
                 if (err.errors[errName].message)
                     message = err.errors[errName].message;
             }
         } else {
             message = 'Unknown server error';
         }
     }
     return message;
 };