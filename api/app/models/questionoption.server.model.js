const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionoptionSchema = new Schema({
    option: {
        type: String,
        required: true
    },

    correctOption:{
        type: Boolean,
        required: true
    },

    weighting: {
        type: Number
    } 
   
   
},
{ timestamps: true }
);

module.exports = mongoose.model("QuestionOptions", questionoptionSchema);