const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
    title: {
        type: String,
        required: true
      },
      lecture: [{
        type: mongoose.Schema.ObjectId,
        ref: 'lecture'
      }]

   
},
{ timestamps: true }
);

module.exports = mongoose.model("Sections", sectionSchema);