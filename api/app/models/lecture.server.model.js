const mongoose = require('mongoose');


const lectureSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['video', 'text'],
        required: true
    },
    videoUrl: {
        type: String,
        required: () => this.type === 'video'
    },
    duration: {
        type: String,
        required: () => this.type === 'video'
    },
    text: {
        type: String,
        required: () => this.type === 'text'
    },
   
},
{ timestamps: true }
);

module.exports = mongoose.model("Lecture", lectureSchema);