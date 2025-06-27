const { name } = require('ejs');
const mongoose = require('mongoose');
const { toNamespacedPath } = require('path/posix');


const sswData = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    userid:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    bio_url: {
        type: String,
        required: true
    }, 
    type: {
        type: String,
        required: true
    }
});
const skillServiceWeb = mongoose.model('sswData', sswData);

module.exports = skillServiceWeb;