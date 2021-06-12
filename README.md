# nofise
Simple NodeJS File Server

Define a directory and start the server. You can upload files with a simple
HTML form. The server can also serve the files, but this is recommended only 
in development enviroments.

Basically this is a simple combination of [Express](https://expressjs.com/) 
with [Express-Fileupload](https://www.npmjs.com/package/express-fileupload). 

WARNING: No authentication at all! Do not use this on the open internet!

## Options

All options must be provided via environment variables.

FILEPATH=/files/

Serving files from FILEROOT (see below) with this path.
 
URLPATH=/

The path under nofise serves files, usually a "/"

FILEROOT=./fileroot

The directory to store and serve files from.
Beware: Only in "development" enviroment (see below) files are served. 
In production use a proxy like nginx to serve the files.

NODE_ENV=development

The enviroment, only development setting can serve files.

DEBUG=nofise:*

See [DEBUG](https://github.com/visionmedia/debug#readme) module. 
Skip this setting to suppress log messages.


