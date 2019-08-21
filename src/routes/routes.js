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
        const data = JSON.parse(body)
        res.redirect(`http://localhost:3000/convert?job=${data.id}`)
    }
}).auth(apiKey, '', true);

})

router.get("/convert", (req, res) => {

request.get ('https://sandbox.zamzar.com/v1/jobs/' + 7083769, function (err, response, body) {
    if (err) {
        console.error('Unable to get job', err);
    } else {
        console.log('SUCCESS! Got job:');
        const data = JSON.parse(body)
        res.redirect(`http://localhost:3000/download?id=${data.target_files[0].id}`)
        
        // res.json(JSON.parse(body))
    }
}).auth(apiKey, '', true);
});

router.get('/download', (req, res) => {

    const fileID = 54393372;
    const localFilename = `src/files/downloads/${uuid()}.odt`;

// Note: NPM's request library is incompatible with our API when its followRedirect flag is turned
// on. Instead, this sample code performs a manual redirect if necessary.

request.get({url: 'https://sandbox.zamzar.com/v1/files/' + req.query.id + '/content', followRedirect: false}, 
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

/*
{
"id": 7083769,
"key": "8615b3bff79cd35b1771ce9977ed48e39d7fc788",
"status": "initialising",
"sandbox": true,
"created_at": "2019-08-21T23:45:10Z",
"finished_at": null,
"source_file": {
"id": 54393779,
"name": "4424649a-d83f-4ea0-8858-59af4624911d.docx",
"size": 65944
},
"target_files": [],
"target_format": "odt",
"credit_cost": 2
}

{
"id": 7083769,
"key": "8615b3bff79cd35b1771ce9977ed48e39d7fc788",
"status": "successful",
"sandbox": true,
"created_at": "2019-08-21T23:45:10Z",
"finished_at": "2019-08-21T23:45:14Z",
"source_file": {
"id": 54393779,
"name": "4424649a-d83f-4ea0-8858-59af4624911d.docx",
"size": 65944
},
"target_files": [
{
"id": 54393780,
"name": "4424649a-d83f-4ea0-8858-59af4624911d.odt",
"size": 21044
}
],
"target_format": "odt",
"credit_cost": 2
}

 */