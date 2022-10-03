const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionanswerSchema = new Schema({
    answer: {
        type: String,
        required: true
    },
    question: [{
        type: mongoose.Schema.ObjectId,
        ref: 'question'
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

module.exports = mongoose.model("Answer", questionanswerSchema);