const { name } = require('ejs');
const mongoose = require('mongoose');


const projectPicData = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    projectid:{
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});
const projectPic = mongoose.model('projectPicData', projectPicData);

module.exports = projectPic;