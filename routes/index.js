const express = require('express');
const router = express.Router();
//const debug = require('debug')('nofise:server');

// file upload
const fileUploadMiddleware = require('express-fileupload')(
    { debug: (process.env.NODE_ENV === 'development'), safeFileNames: false, preserveExtension: true });

// Read directory
const FileContainer = require('../lib/FileContainer');
const FILEROOT = process.env.FILEROOT;
if (!FILEROOT) {
  throw new Error('FILEROOT is not defined, define FILEROOT environment property')
}
const URLPATH = process.env.URLPATH;

const FILEPATH = process.env.FILEPATH;
if (!FILEPATH) {
  throw new Error('FILEPATH is not defined, define FILEPATH environment property')
}
const myFileContainer = new FileContainer(FILEROOT, FILEPATH);

// Define routes

/* GET home page: / */
router.get('/', (req, res) => {
  res.render('index', { urlpath: URLPATH, filepath: FILEPATH, fileroot: FILEROOT, files: myFileContainer.getFiles() });
});

/* File upload: /upload */
router.post(`/upload`, fileUploadMiddleware, (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let myNewFile = req.files.newfile;

  myNewFile.mv(`${FILEROOT}/${req.files.newfile.name}`, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    myFileContainer.readDirectory().then((files) => {
      res.render('index', { myNewFile: myNewFile, urlpath: URLPATH, filepath: FILEPATH, fileroot: FILEROOT, files: files });
    }).catch((err) => {
      return res.status(500).send(err);
    })
  });
});

/* Delete file: /delete */
router.get(`/delete/:filename`, (req, res) => {
  myFileContainer.deleteFile(req.params.filename).then(() => {
    res.redirect(URLPATH);
  }).catch((err) => {
    res.status(500).send(err);
  });
})

module.exports = router;
