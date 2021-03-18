'use strict';
const http = require('http');
require('dotenv').config({silent: true});

const express = require('express');
const app = express();
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hola Mundo');
});

const toneAnalyzer = new ToneAnalyzerV3({
    version: '2019-10-10',
    authenticator: new IamAuthenticator({
      apikey: process.env.TONE_ANALYZER_IAM_APIKEY,
    }),
    url: process.env.TONE_ANALYZER_URL,
  });

  require('./config/express')(app);

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/api/tone', async function(req, res, next) {
  try {
    const { result } = await toneAnalyzer.tone(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

require('./config/error-handler')(app);

server.listen(port, hostname, () => {
  console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
});