const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lectureSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text'],
        required: true
    },

    text: {
        type: String,
        required: () => this.type === 'text'
    },
   
},
{ timestamps: true }
);

module.exports = mongoose.model("Lecture", lectureSchema);