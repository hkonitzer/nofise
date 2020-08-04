const express = require('express');
const router = express.Router();
const debug = require('debug')('nofise:server');

// file upload
const fileUploadMiddleware = require('express-fileupload')(
    { debug: (process.env.NODE_ENV === 'development'), safeFileNames: false, preserveExtension: true });

// Read directory
const FileContainer = require('../lib/FileContainer');
const FILEROOT = process.env.FILEROOT;
if (!FILEROOT) {
  throw new Error('FILEROOT is not defined, define FILEROOT environment property')
}
const myFileContainer = new FileContainer(FILEROOT);

// Define routes

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { fileroot: FILEROOT, files: myFileContainer.getFiles() });
});

/* File upload: /upload */
router.post('/upload', fileUploadMiddleware, function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let myNewFile = req.files.newfile;

  // Use the mv() method to place the file somewhere on your server
  myNewFile.mv(`${FILEROOT}/${req.files.newfile.name}`, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    myFileContainer.readDirectorySync(); // @TODO: Create an async function and send response afterwards
    res.render('fileuploaded', { myNewFile: myNewFile });
  });
});

module.exports = router;
