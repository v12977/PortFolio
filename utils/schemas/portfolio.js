const { name } = require('ejs');
const mongoose = require('mongoose');


const portFolioData = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    userid:{
        type: String,
        required: true
    },
    name:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
        default:"project"
    },
    category: {
        type: String,
        required: true,
        default:"none"
    },
    client: {
        type: String,
        required: true,
        default:"Self"
    },
    projectdate:{
        type:String,
        required:true,
        default:"none"
    },
    projecturl:{
        type:String,
        required:true,
        default:"none"
    },
    projectbio:{
        type:String,
        required:true,
        default:"none"
    },
    projectimage:{
        type:String,
        required:true,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmyUQuC3fk5ojtPa7ZpUf1OJv3yyEiJ1CeHYiGzCgGyEJH317br0SHQVDhYbAIbeTnH4o&usqp=CAU"
    }
});
const portFolio = mongoose.model('portFolioData', portFolioData);

module.exports = portFolio;