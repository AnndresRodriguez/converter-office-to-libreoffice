const request = require("request");
const fs = require("fs");
const apiKey = process.env.API_TOKEN;
const uuid = require("uuid/v4");
const path = require("path");


let serviceZamzar = {
  validateFile: format => {
    request.get(`https://sandbox.zamzar.com/v1/formats/${format}`, function(err,response,body) {
        if (err) {
          console.error("Unable to get formats", err);
          return {"error": "Unabled to get Formats"}
        } else {
          return JSON.parse(body);
        }
      }).auth(apiKey, "", true);
  },

  uploadFile: (targetFormat, filename) => {
    const formData = {
        target_format: `${targetFormat}`,
        source_file: fs.createReadStream(`src/files/uploads/${filename}`)
    };

    return new Promise((resolve, reject) => {

      request.post({url:'https://sandbox.zamzar.com/v1/jobs/', formData: formData}, function (err, response, body) {
    if (err) {
        console.error('Hubo un error al realizar la conversion', err);
        reject(0)
    } else {
        console.log('Conversion Realizada datos de su conversion');
        const data = JSON.parse(body)
        resolve(data.id)
        // console.log('Convert id', data.id)
        //res.redirect(`http://localhost:3000/convert?job=${data.id}`)
    }
    }).auth(apiKey, '', true);

    })
    
  },
  convertFile: queryJob => {
    
    return new Promise((resolve, reject)=> {

      request.get('https://sandbox.zamzar.com/v1/jobs/' + queryJob, function (err, response, body)
      {
          if (err) {
              console.error('Unable to get job', err);
              reject(0)
          } else {
              const data = JSON.parse(body)
              console.log('ConvertFile ID', data.id)
              resolve(data.id)            
          }
      }).auth(apiKey, '', true);

    })
  
  },
  validateStatus: (idJob) => {

    return new Promise((resolve, reject) => {

    request.get('https://sandbox.zamzar.com/v1/jobs/' + idJob, function (err, response, body)
    {
        if (err) {
            console.error('No se pudo obtener el estado del archivo', err);
            reject({"error": "can´t get status file"});
        } else {
            console.log('Estado validado');
            const data = JSON.parse(body);
            resolve(data);
            // res.json(data);
            // res.redirect(`http://localhost:3000/download?id=${data.target_files[0].id}`)
            // res.json(JSON.parse(body));
        }
    }).auth(apiKey, '', true);
    })    
  }
};

module.exports = serviceZamzar;
