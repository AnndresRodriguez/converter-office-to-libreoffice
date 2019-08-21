const express = require('express')
const router = express.Router();
const request = require('request');
const fs = require('fs');
const apiKey = process.env.API_TOKEN;
const uuid = require('uuid/v4')

router.get("/", (req, res) => {
    res.render("index")
})

router.get("/validate", (req, res) => {

    request.get('https://sandbox.zamzar.com/v1/formats/doc', function (err, response, body) {
    if (err) {
        console.error('Unable to get formats', err);
    } else {
        res.json(JSON.parse(body))
        
    }
}).auth(apiKey, '', true);
})

router.post("/doctoodt", (req, res) => {

  
})

router.post("/upload", (req, res) => {
 
    const formData = {
        target_format: 'odt',
        source_file: fs.createReadStream(`src/files/uploads/${req.file.filename}`)
    };

    request.post({url:'https://sandbox.zamzar.com/v1/jobs/', formData: formData}, function (err, response, body) {
    if (err) {
        console.error('Hubo un error al realizar la conversion', err);
    } else {
        console.log('Conversion Realizada datos de su conversion');
        res.json(JSON.parse(body))
    }
}).auth(apiKey, '', true);

})

router.get("/convert", (req, res) => {
    
const jobID = 7066883;

request.get ('https://sandbox.zamzar.com/v1/jobs/' + jobID, function (err, response, body) {
    if (err) {
        console.error('Unable to get job', err);
    } else {
        console.log('SUCCESS! Got job:');
        res.json(JSON.parse(body))
    }
}).auth(apiKey, '', true);
});

router.get('/download', (req, res) => {

    const fileID = 54311607;
    const localFilename = `src/files/downloads/${uuid()}.odt`;

// Note: NPM's request library is incompatible with our API when its followRedirect flag is turned
// on. Instead, this sample code performs a manual redirect if necessary.

request.get({url: 'https://sandbox.zamzar.com/v1/files/' + fileID + '/content', followRedirect: false}, 
function (err, response, body) {
    if (err) {
        console.error('Unable to download file:', err);
    } else {
        console.log('response header:', response.headers.location)
        // We are being redirected
        if (response.headers.location) {
            // Issue a second request to download the file
            var fileRequest = request(response.headers.location);
            fileRequest.on('response', function (res) {
                res.pipe(fs.createWriteStream(localFilename));
            });
            fileRequest.on('end', function () {
                console.log('Descarga Completada');
            });
        }
    }
}).auth(apiKey,'',true).pipe(fs.createWriteStream(localFilename));

res.redirect("http://localhost:3000/")

})

module.exports = router