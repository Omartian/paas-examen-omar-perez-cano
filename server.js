'use strict';

require('dotenv');


const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const toneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const toneAnalyzer = new toneAnalyzerV3({
  version: '2017-09-21',
  authenticator: new IamAuthenticator({
    apikey: process.env.APIKEY,
  }),
  url: process.env.URL,
  disableSslVerification: true
});

app.get('/', function(req, res) {
  res.send('Tone Analyzer using IBM Cloud Node app example');
});

const text = 'Team, I know that times are tough! Product '
+ 'sales have been disappointing for the past three '
+ 'quarters. We have a competitive product, but we '
+ 'need to do a better job of selling it!';

app.post('/get-tone', async function(req, res, next) {
  const toneParams = {
    toneInput: { 'text': req.body.text },
    contentType: 'application/json',
  };
    toneAnalyzer.tone(toneParams)
    .then(toneAnalysis => {
      console.log(JSON.stringify(toneAnalysis, null, 2));
      res.send(JSON.stringify(toneAnalysis, null, 2));
      //res.render("index", {
      //  response:JSON.stringify(toneAnalysis, null, 2)
      //});
    })
    .catch(err => {
      console.log('error:', err);
    });
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
  // eslint-disable-next-line no-console
  console.log('Server running on port: %d', port);
});