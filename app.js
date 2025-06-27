const express=require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path=require('path');
const { createServer } = require("http");
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const { configDotenv } = require('dotenv');
// const { rejects } = require('assert');
require('dotenv').config();
const mongooes = require('mongoose');
const fs = require('fs');
const multer = require('multer');
const { cloudinary, storage } = require('./utils/cloud/cloud.js');
const upload = multer({ storage }); // use the cloudinary storage
const MongoStore = require('connect-mongo');

let url='https://myportfolio-hsc7.onrender.com';
 


// ............................................... database file-connection...............................................
async function main(params) {
    await mongooes.connect(process.env.MONGO_URL);
}
//                                       calling the main() function 
main().then(()=>{
    console.log("conneced to the Mongoose database");
}).catch((err)=>{
    console.log(err);
});

// ............................................... import schema files...............................................
const basicData = require('./utils/schemas/basicdata.js');
const portFolio=require('./utils/schemas/portfolio.js');
const skillServiceWeb=require('./utils/schemas/skill_service_web.js');
const resumeData=require('./utils/schemas/resume.js');
const sendMessage=require('./utils/email/sendmail.js');
const projectPic=require('./utils/schemas/pic_project.js');
const { name } = require('ejs');
// basicData.insertOne(basicdata).then((result)=>{console.log("data Save!")}).catch((err)=>{console.log(err);});

// ............................................import error handler file...........................................
const errHandler=require('./errorclass/err.js');

//............................................... app configurations ...............................................
const app=express();
const port=3000;

// ............................................... website port setup ...............................................
app.listen(port,()=>{
    console.log("You are online");
    console.log("App is listing on port: ",port);
});

//............................................... files and folders setups ...............................................
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({ extended:true }));
app.use(express.static(path.join(__dirname,'/public')));
app.use(bodyParser.urlencoded({ extended: true }));

// ...............................................session store setup ...............................................
const store=MongoStore.create({
  mongoUrl: process.env.MONGO_URL, // MongoDB connection string
  crypto:{
    secret: process.env.SECRETKEY, // Secret key used to encrypt session data
  },
  touchAfter:24*3600
});
// ...............................................Session config...............................................
app.use(session({
  store:store,
  secret: process.env.SECRETKEY, // Secret key used to sign the session ID cookie
  resave: false, // Whether to save the session data if no changes are made
  saveUninitialized: false // Whether to save uninitialized sessions
}));
store.on('error',(err)=>{
  console.log("Session Store Error : ",err);
});


// ...............................................Routers ................................................

// ............................................get Routers........................................
app.get("/",async (req,res)=>{
  res.redirect("/myport");
});

app.get("/myport",async (req,res)=>{
  let bd=await basicData.findOne({email:{$eq:`${process.env.GETEMAIL}`}});// bd= basic data
  let ssw=await skillServiceWeb.find({userid:{$eq:`${process.env.GETEMAIL}`}});// ssw= skill,services,website data
  let skill=await skillServiceWeb.find({$and:[{userid:`${process.env.GETEMAIL}`},{type:`skill`}]});// ssw= skill data
  let rd=await resumeData.find({userid:{$eq:`${process.env.GETEMAIL}`}});// rd= resume data
  let pfd=await portFolio.find({userid:{$eq:`${process.env.GETEMAIL}`}});// pfd= portfolio data
  let c=parseInt(skill.length/2);
  let i=1;
  res.render("index.ejs",{url,bd,ssw,skill,rd,pfd,c,i});
});

app.get("/portfolio/:id",async (req,res)=>{
  let bd=await basicData.findOne({email:{$eq:`${process.env.GETEMAIL}`}});// bd= basic data
  let ssw=await skillServiceWeb.find({userid:{$eq:`${process.env.GETEMAIL}`}});// ssw= skill,services,website data
  let pfd=await portFolio.findOne({id:{$eq:`${req.params.id}`}});// pfd= portfolio data
  let pi=await projectPic.find({projectid:{$eq:`${req.params.id}`}});// pfd= portfolio data
  res.render("portfolio-details.ejs",{url,pfd,pi,ssw,bd});
});

app.get("/starter/page",async (req,res)=>{
  if(req.session.validation==true){
    let bd=await basicData.findOne({email:{$eq:`${process.env.GETEMAIL}`}});// bd= basic data
    let ssw=await skillServiceWeb.find({userid:{$eq:`${process.env.GETEMAIL}`}});// ssw= skill,services,website data
    let skill=await skillServiceWeb.find({$and:[{userid:`${process.env.GETEMAIL}`},{type:`skill`}]});// ssw= skill data
    let rd=await resumeData.find({userid:{$eq:`${process.env.GETEMAIL}`}});// rd= resume data
    let pfd=await portFolio.find({userid:{$eq:`${process.env.GETEMAIL}`}});// pfd= portfolio data
    let c=parseInt(skill.length/2);
    let i=1;
    res.render("starter-page.ejs",{url,bd,ssw,skill,rd,pfd,c,i});
  }
  else{
    res.render("login/login.ejs",{url});
  }
});

app.get("/setting/portfolio/:id",async (req,res)=>{
  let bd=await basicData.findOne({email:{$eq:`${process.env.GETEMAIL}`}});// bd= basic data
  let pfd=await portFolio.findOne({id:{$eq:`${req.params.id}`}});// pfd= portfolio data
  let pi=await projectPic.find({projectid:{$eq:`${req.params.id}`}});
  res.render("settings/portfolio-details.ejs",{url,pfd,pi,bd});
});




// .................................................post routers.........................

// .....................update name and shoeprofession data............................
app.post('/update/basic/data', async(req,res)=>{
  let upd=req.body;

  await basicData.findOneAndUpdate({email:{$eq:`${process.env.GETEMAIL}`}},{$set:upd})
  .then(updatedUser => 
    {
      console.log("name and showprofession updated!");
      res.redirect('/starter/page');
    })
  .catch(err => {
    console.error(err);
    res.send("Not Updated. Something is Wrong");
  });

});


// .....................add skill, service or website data............................
app.post('/add/ssw/:id', async(req,res)=>{
  let addd=req.body;
  let d={id:uuidv4(),userid:process.env.GETEMAIL,name:addd.name,bio_url:addd.bio_url,type:req.params.id}
  skillServiceWeb.insertOne(d)
  .then((result)=>{
    console.log("ssw data Save!");
    res.redirect('/starter/page');
  })
  .catch((err)=>{
    console.log(err);
    res.send("Not added. Something is Wrong");
  });

});

//........................................add resume data router......................................
app.post('/add/resume/data',async(req,res)=>{
  let d={id:uuidv4(),userid:process.env.GETEMAIL,rtype:req.body.type,rname:req.body.rname,ryear:req.body.year,rbio:req.body.rbio,runiversity:req.body.university}
  resumeData.insertOne(d)
  .then((result)=>{
    console.log("ssw data Save!");
    res.redirect('/starter/page');
  })
  .catch((err)=>{
    console.log(err);
    res.send("Not added. Something is Wrong");
  });
});

//........................................add portfolio data router......................................
app.post('/add/portfolio/data',async(req,res)=>{
  let d={id:uuidv4(),userid:process.env.GETEMAIL,name:req.body.name,type:req.body.type}
  portFolio.insertOne(d)
  .then((result)=>{
    console.log("ssw data Save!");
    res.redirect('/starter/page');
  })
  .catch((err)=>{
    console.log(err);
    res.send("Not added. Something is Wrong");
  });
});

// .....................update name and shoeprofession data............................
app.post('/update/portfolio/data/:id', async(req,res)=>{
  let upd=req.body;
  await portFolio.findOneAndUpdate({id:{$eq:`${req.params.id}`}},{$set:upd})
  .then(updatedUser => 
    {
      console.log("name and showprofession updated!");
      res.redirect(`/setting/portfolio/${req.params.id}`);
    })
  .catch(err => {
    console.error(err);
    res.send("Not Updated. Something is Wrong");
  });
});

// .......................................for the image routers .......................

// This route handles file uploads using multer and Cloudinary
app.post('/upload/:field/:id',upload.fields([
  { name: 'profilePic', maxCount: 1 }
]),async (req, res) => {

  const profilePicUrl = req.files['profilePic']?.[0]?.path;
  let d;
  switch (req.params.field) {
    case 'basicdata':
        if(req.params.id=='pr'){
          d={
            primage: profilePicUrl
          }
        }
        if(req.params.id=='bg'){
          d={
            bgimage: profilePicUrl
          }
        }
        await basicData.findOneAndUpdate({email:{$eq:`${process.env.GETEMAIL}`}},{$set:d})
        .then(updatedUser => {
          console.log("name and showprofession updated!");
          res.redirect('/starter/page');
        })
        .catch(err => {
          console.error(err);
          res.send("Not Updated. Something is Wrong");
        });
    break;
    case 'project':
      d={
        id:uuidv4(),
        projectid:req.params.id,
        url: profilePicUrl
      }
      await projectPic.insertOne(d)
      .then((result)=>{
        console.log("data Save!");
        res.redirect(`/setting/portfolio/${req.params.id}`);
      })
      .catch((err)=>{
        console.error(err);
        res.send("Not Updated. Something is Wrong");
      });

    break;
  
    default:
      res.send("err");
      break;
  }
});

// ...........................delete router for all data .....................................

app.get('/myPortFolio/delete/:field/:id',async(req,res)=>{
switch (req.params.field) {
  case 'skill':
      await skillServiceWeb.findOneAndDelete({id:{$eq:`${req.params.id}`}})
      .then(updatedUser => {
        console.log("Skill Data Deleted!");
        res.redirect('/starter/page');
      })
      .catch(err => {
        console.error(err);
        res.send("Not Deleted. Something is Wrong");
      });
    break;
  case 'resume':
      await resumeData.findOneAndDelete({id:{$eq:`${req.params.id}`}})
      .then(updatedUser => {
        console.log("Resume Data Deleted!");
        res.redirect('/starter/page');
      })
      .catch(err => {
        console.error(err);
        res.send("Not Deleted. Something is Wrong");
      });
    break;
  case 'portfolio':
      await portFolio.findOneAndDelete({id:{$eq:`${req.params.id}`}})
      .then(updatedUser => {
        console.log("Portfolio Data Deleted!");
        res.redirect('/starter/page');
      })
      .catch(err => {
        console.error(err);
        res.send("Not Deleted. Something is Wrong");
      });
    break;
  case 'project':
      await projectPic.findOneAndDelete({id:{$eq:`${req.params.id}`}})
      .then(updatedUser => {
        console.log("project Image Deleted!");
        res.redirect('/starter/page');
      })
      .catch(err => {
        console.error(err);
        res.send("Not Deleted. Something is Wrong");
      });
    break;
  default:
    res.send('err');
    break;
}
});

// ................................................Contect email router.........................

// ...............................................contact Page Router...............................................
app.post('/myportfolio/contact',async(req,res)=>{
  const { name, senderemail, mobile, subject, message } = req.body;

  if (!name || !senderemail || !mobile || !subject || !message) {
    return res.status(400).send('All fields except message are required.');
  }

  try {
    // await sendEmail({ name, senderemail, mobile, subject, message });
    await sendMessage(req.body);
    return res.redirect('/MyPortfolio/200/Status');
  } catch (err) {
    console.error('Email error:', err);
    return res.redirect('/MyPortfolio/500/Status');
  }
});


// ................................................err Status Message page Router...............................................
app.get('/MyPortfolio/:status/Status',async (req,res)=>{
  let status= req.params.status;
  res.render("tem_mess/mess.ejs",{status,url});
});

// ...............................................Admin Validation.............................................
app.post('/myport/admin/validation',async(req,res)=>{
  if(String(req.body.admin)==process.env.ADMINKEY && String(req.body.password)==process.env.ADMINPASS){
    req.session.validation=true;
    res.redirect("/starter/page");
  }
  else{
    return res.redirect('/MyPortfolio/401/Status');
  }
});
app.get('/logout',async(req,res)=>{
    req.session.validation=false;
    res.redirect('/');
});


// ...............................................Error Handler................................................
app.use(async(err,req,res,next)=>{
  console.log(err.status);
  dmess=`
  <div style="height: 50vh;width: 100%;display: flex;flex-wrap: wrap;align-items: center;justify-content: center;">
  <h1 style="width: 100%;display: flex;flex-wrap: wrap;align-items: center;justify-content: center;">There is and server error 😔</h1> 
  <h3 style="width: 100%;display: flex;flex-wrap: wrap;align-items: center;justify-content: center;"> You can report this on email : ${process.env.GETEMAIL}</h3>
  <p>Please attach a screenshot of error with report mail.</p>
  </div>
  `;
  let {status=500,message=dmess}=err;
  mess=`
  <div style="height: 50vh;width: 100%;display: flex;flex-wrap: wrap;align-items: center;justify-content: center;">
  <h1 style="width: 100%;display: flex;flex-wrap: wrap;align-items: center;justify-content: center;">There is and server error (<k style="color:red;">"${message}"<k>) 😔</h1> 
  <h3 style="width: 100%;display: flex;flex-wrap: wrap;align-items: center;justify-content: center;"> You can report this on email : <k style="color:blue;">${process.env.GETEMAIL}</k></h3>
  <p>Please attach a screenshot of error with report mail.</p>
  </div>
  `;
  res.status(status).send(mess);
});