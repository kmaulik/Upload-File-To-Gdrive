var express = require('express');
// var mongoose = require('mongoose');
// const fileUpload = require('express-fileupload');
var router = express.Router();
const readline = require('readline');
const {google} = require('googleapis');
const fs = require('fs');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = '../upload_to_drive/token.json';


// const uuidv4 = require('uuid/v4');
// var path = require('path')

/* Upload Fils . */
router.post('/upload_file', function(req, res, next) {
    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), uploadFile);
  });
    function uploadFile(auth){
        const drive = google.drive({version: 'v3', auth});
        var fileMetadata = {
            'name': '01728081-da12-4eb5-abcd-976c61f3b713.jpg'
          };
          var media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream('../upload_to_drive/uploads/01728081-da12-4eb5-abcd-976c61f3b713.jpg')
          };
          drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
          }, function (err, file) {
            if (err) {
              // Handle error
              console.error(err);
            } else {
              console.log('File Id: ', file.id);
            }
        });
    }
   
});


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }
  
  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

module.exports = router;