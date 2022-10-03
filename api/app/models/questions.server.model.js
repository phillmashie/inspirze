const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    questionoption: [{
        type: mongoose.Schema.ObjectId,
        ref: 'questionoption'
      }]
   
},
{ timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);