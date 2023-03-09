const express = require("express");
const path = require("path");
const Policy = require('../controllers/users/Policy');
// require("dotenv").config({path:'../.env'});
const hbs = require('hbs')
const bodyparser = require('body-parser')
const session = require('express-session')
const fileUpload = require("express-fileupload");
const Port = process.env.Port  || 4700;
// routes 
const route_users = require('../routes/users')
const multer = require("multer")
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // uploads is the Upload_folder_name
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_ " + file.originalname)   
    }
  })
    
var upload = multer({ 
   storage: storage
//files is the name of file attribute
})
.single("files");


const app = express()
app.post("/addPolicies",function (req, res, next) {
    upload(req,res,function(err) {
        if(err) {
            res.send(err)
        }
        else {
            var filePath= res.req.file.path; 
            Policy.addPolicies(req, res, filePath);
        }
    })
})
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

// Passing fileUpload as a middleware
app.use(fileUpload());

const pageDirectory = path.join(__dirname, '../public')
const viewsPartials = path.join(__dirname, '../partials')
const header = path.join(__dirname + '../partials/header.hbs');
const viewsDirectory = path.join(__dirname, '../views')

app. set('view engine', 'hbs');
app.set('views', viewsDirectory);
hbs.registerPartials(viewsPartials);
hbs.registerPartial('header', header);

app.use(express.static(pageDirectory))
app.use(session({
    secret: 'key1',
    resave: false,
    saveUninitialized: false
}))

app.use(route_users);
app.get('*', (req, res) => {
    res.render('404');
})

app.listen(Port, () => {
    console.log('server is up at port:' + Port);
})
