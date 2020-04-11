const express = require('express')
const router = express.Router();
const request = require('request');
const fs = require('fs');
const apiKey = process.env.API_TOKEN;
const uuid = require('uuid/v4')
const path = require("path")
const zamzar = require("../lib/zamzar");

router.get("/", (req, res) => {
    res.render("index")
})

router.get("/validate", async(req, res) => {

    const responseValidate = await zamzar.validateFile('xls');
    res.json(responseValidate)
    
})

router.post("/upload", async (req, res) => {

    const responseUpload = await zamzar.uploadFile("odt", req.file.filename)
    console.log('responseUpload', responseUpload);
    // res.redirect(`http://localhost:3000/convert?job=${responseUpload}`)
     res.redirect(`${process.env.URL_API}/convert?job=${responseUpload}`)

})

router.post("/ppttoodp", async (req, res) => {

    const responseUploadPpt = await zamzar.uploadFile("odp", req.file.filename)
    console.log('responseUploadPpt', responseUploadPpt);
    // res.redirect(`http://localhost:3000/convert?job=${responseUpload}`)
     res.redirect(`${process.env.URL_API}/convert?job=${responseUploadPpt}`)

})

router.post("/xlstoods", async (req, res) => {

    const responseUploadOds = await zamzar.uploadFile("ods", req.file.filename)
    console.log('responseUploadOds', responseUploadOds);
    // res.redirect(`http://localhost:3000/convert?job=${responseUpload}`)
     res.redirect(`${process.env.URL_API}/convert?job=${responseUploadOds}`)

})

router.post("/odttodoc", async (req, res) => {

    const responseUpload = await zamzar.uploadFile("pdf", req.file.filename)
    console.log('responseUploadOdt', responseUpload);
    // res.redirect(`http://localhost:3000/convert?job=${responseUpload}`)
    res.redirect(`${process.env.URL_API}/convert?job=${responseUpload}&conv=1`)

})

router.get("/convert", async(req, res) => {

    const responseConvert = await zamzar.convertFile(req.query.job);
    console.log('responseConvert', responseConvert);
    res.redirect(`${process.env.URL_API}/validatestatus?id=${responseConvert}`)

});

router.get('/validatestatus',(req, res) => {

    setTimeout(async () =>{

        console.log('req.query.id', req.query.id)
        const responseStatus = await zamzar.validateStatus(req.query.id);
            if(responseStatus.target_files[0].id === undefined){
                res.json({"error": "Wait for the conversion file"})
            }else{
                res.redirect(`${process.env.URL_API}/download?id=${responseStatus.target_files[0].id}&name=${responseStatus.target_files[0].name}`)
            }

    }, 8000)

});

router.get('/download', (req, res) => {

    const localFilename = `src/routes/${req.query.name}`;

// Nota: La librería "request" es incompatible con su api cuando la bandera  followRedirect flag cambia a true

    request.get({url: 'https://sandbox.zamzar.com/v1/files/' + req.query.id + '/content', followRedirect: false}, function (err, response, body) {
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

setTimeout(() => {
    res.download(`${ __dirname + '/' + path.basename(localFilename)}`)
}, 3000)

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