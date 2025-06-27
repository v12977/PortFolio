// sendEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config();


// Create a transporter object
const transporter = nodemailer.createTransport({
    host:process.env.EMAILHOST,
    port: 465,
    secure: true, // use SSL
    auth: {
      user:process.env.EMAIL,
      pass:process.env.PASSWORD,
    }
});


// .................................Email message creator ....................
// Configure the mailoptions object
function messageCreate(data){
    console.log(data);
    const mailOptions = {
        from: `"${data.name}" <${data.senderemail}>`,
        to: process.env.GETEMAIL,
        subject: data.subject,
        html: `
          <div style="font-family: Arial; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #4CAF50;">New Contact Message Form MyPortFolio</h2>
            <hr><hr>
            <p><strong>Name : </strong>kishore</p>
            <p><strong style="font-size:large; color:white;">Email : </strong> ${data.senderemail}</p>
            <p><strong style="font-size:large; color:white;">Phone : </strong> ${data.mobile}</p>
            <p><strong style="font-size:large; color:white;">Subject : </strong> ${data.subject}</p>
            <hr>
            <p>${data.message || '(No message provided)'}</p>
          </div>
        `
    };
    return(mailOptions);
}

// Send the email
let sendMessage=async (data)=>{
    return new Promise((resolve,rejects)=>{
        const mail = messageCreate(data);
        transporter.sendMail(mail, function(error, info){
            if (error) {
              console.log('Error:', error);
              rejects(error);
            } else {
              console.log('Email sent:', info.response);
              resolve(true);
            }
          });
    });
};


module.exports = sendMessage;

