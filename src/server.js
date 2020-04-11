const path = require('path')
const express = require("express");
const morgan = require("morgan");
const app = express();
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const uuid = require("uuid/v4");
const ejs = require("ejs")
require('dotenv').config();



//------------------------------Multer-----------------------------------------

const storage = multer.diskStorage({

	destination: path.join(__dirname, 'files/uploads/'),
	filename: (req, file, cb) =>{
		cb(null, uuid() + path.extname(file.originalname).toLowerCase());
	}

});

const upload = app.use(multer({
	storage,
	dest: path.join(__dirname, 'files/uploads/'),
	limits: {filesize: 1000000}
	// ,
	// fileFilter: (req, file, cb) => {
	// 	const fileTypes = /ppt|xls|docx/;
	// 	const mimetype = fileTypes.test(file.mimetype);
	// 	const extname = fileTypes.test(path.extname(file.originalname));

	// 	if(mimetype && extname){
	// 		return cb(null, true)
	// 	}

	// 	cb("Error: los archivos deben ser en extension docx")
	// }
}).single('file'))

//--------------------------------------------------------------------------------

//cors
app.use(cors());



//Bodyparser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Settings Port
app.set("port", process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// Morgan y JSON
app.use(morgan("dev"));
app.use(express.json());

// Routes Controllers

app.use(require("./routes/doctoodt"))

//app.use('/admin', adminController);



//Static Files

app.use(express.static(__dirname + '/public'));

//Listening server
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});

