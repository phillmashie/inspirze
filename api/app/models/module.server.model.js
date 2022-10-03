const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
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

module.exports = mongoose.model("Modules", moduleSchema);