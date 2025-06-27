const { name } = require('ejs');
const mongoose = require('mongoose');


const resume_Data = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    userid:{
        type: String,
        required: true
    },
    rtype: {
        type: String,
        required: true
    },
    rname: {
        type: String,
        required: true
    },
    ryear: {
        type: String,
        required: true
    },
    rbio:{
        type:String,
        required:true
    },
    runiversity:{
        type:String,
        required:true
    }
});
const resumeData = mongoose.model('resume_Data', resume_Data);

module.exports = resumeData;