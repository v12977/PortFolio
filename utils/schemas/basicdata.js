const { name } = require('ejs');
const mongoose = require('mongoose');

const basicDataSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    bgimage:{
        type: String,
        required: true,
        default:"none"
    },
    primage: {
        type: String,
        required: true,
        default:'none'
    },
    name: {
        type: String,
        required: true,
        default:"Kishor Kumar"
    },
    showprofession: {
        type: String,
        required: true,
        default:"Designer, Full-Stack Flask Developer, Full-Stack Node.js Developer"
    },
    birthdate: {
        type: Date,
        required: true,
        default:new Date('2025-12-31')
    },
    age:{
        type:String,
        required:true,
        default:"21"
    },
    website:{
        type: String,
        required:true,
        default:"none"
    },
    phone:{
        type: String,
        required:true,
        default:"+91 xxxxx-xxxxx"
    },
    city:{
        type:String,
        required:true,
        default:"Delhi"
    },
    bstskill:{
        type:String,
        required:true,
        default:"Web Developer"
    },
    degree:{
        type:String,
        required:true,
        default:"Bachlor"
    },
    email:{
        type:String,
        required:true,
        default:"xxxxxxx@gmail.com"
    },
    workingstatus:{
        type:String,
        required:true,
        default:"unemployed"
    },
    onlineproject:{
        type:String,
        required:true,
        default:"0"
    },
    totalproject:{
        type:String,
        required:true,
        default:"0"
    },
    singleproject:{
        type:String,
        required:true,
        default:"0"
    },
    groupproject:{
        type:String,
        required:true,
        default:'0'
    },
    aboutsummary:{
        type:String,
        required:true,
        default:"Passionate and detail-oriented Web Developer with a strong foundation in full-stack development. I enjoy building responsive and user-friendly websites that solve real-world problems. Always eager to learn and work on exciting, impactful projects."
    },
    skillsummary:{
        type:String,
        required:true,
        default:"I specialize in creating modern and interactive web applications using technologies like HTML, CSS, JavaScript, and Node-Js. My goal is to deliver clean, efficient, and scalable code with a focus on user experience and performance."
    },
    finalsummary:{
        type:String,
        required:true,
        default:"I’m currently seeking new opportunities where I can contribute to innovative projects and grow as a developer. Whether it's collaborating in a team or working independently, I thrive on challenges and continuous learning."
    }
});
const basicData = mongoose.model('BasicData', basicDataSchema);

module.exports = basicData;