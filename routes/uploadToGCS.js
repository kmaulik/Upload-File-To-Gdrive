var express = require('express');
// var mongoose = require('mongoose');
// const fileUpload = require('express-fileupload');
var router = express.Router();

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Your Google Cloud Platform project ID
const projectId = "test-project-219905";

// Creates a client
const storage = new Storage({
  projectId: projectId,
  keyFilename: 'test-project-eb27ca5d62ce.json'
});

// The name for the new bucket
const bucketName = 'staging.test-project-219905.appspot.com';

router.post('/upload_file', function(req, res, next) {    
    // Creates the new bucket
    async function createBucket() {
        await storage.createBucket(bucketName);
        console.log(`Bucket ${bucketName} created.`);
    }
    
    try{
        createBucket();
    }catch (err) {
        console.error('ERROR:', err);
    }
});

module.exports = router;