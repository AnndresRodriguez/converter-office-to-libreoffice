const express = require('express')
const router = express.Router();
require('dotenv').config();
const request = require('request');
const apiKey = process.env.API_TOKEN;

router.get("/uploadfile",  (req, res) => {
    
    res.json({});
  });