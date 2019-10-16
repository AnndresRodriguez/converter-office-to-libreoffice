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

// request.get('https://sandbox.zamzar.com/v1/formats/odt', function (err, response, body) {
//     if (err) {
//         console.error('Unable to get formats', err);
//     } else {
//         console.log('¡Peticion Realizada con exito! FORMATOS SOPORTADOS:', JSON.parse(body));
//     }
// }).auth(apiKey, '', true);


// var request = require('request'),
//     fs = require('fs'),
//     formData = {
//         target_format: 'png',
//         source_file: fs.createReadStream('/tmp/portrait.gif')
//     };

// request.post({url:'https://sandbox.zamzar.com/v1/jobs/', formData: formData}, function (err, response, body) {
//     if (err) {
//         console.error('Unable to start conversion job', err);
//     } else {
//         console.log('SUCCESS! Conversion job started:', JSON.parse(body));
//     }
// }).auth(apiKey, '', true);


// var request = require('request'),
//     jobID = 15;

//     request.get('https://sandbox.zamzar.com/v1/jobs/' + jobID,  function(err, response, body){
//         if(err){
//             console.error('Algo salió Mal en la conversion')
//         }else{
//             console.log('Conversion Completada satisfactoriamente', JSON.parse(body))
//         }
//     }).auth(apiKey, '', true)

//  var request = require('request'),
//     fs = require('fs'),
//     fileID = 3,
//     localFilename = "/tmp/portrait.png";

// request.get({url: 'https://sandbox.zamzar.com/v1/files/' + fileID + '/content', followRedirect: false}, 
// function(err, response, body){
//     if(err){
//         console.error('No se pudo realizar la descarga del Archivo:', err);
//     }else{
//         if(response.headers.location){
//             var fileRequest = request(response.headers.location);
//             fileRequest.on('response', function(res) {
//                 res.pipe(fs.createWriteStream(localFilename));
//             });

//             fileRequest.on('end', function(){
//                 console.log('Descarga del Archivo Completada')
//             })
//         }
//     }
// }).auth(apiKey, '', true).pipe(fs.createWriteStream(localFilename));
