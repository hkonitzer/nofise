const fs = require('fs');
const debug = require('debug')('nofise:server');
const moment = require('moment');
if (process.env.MOMENTLOCALE) {
    moment.locale(process.env.MOMENTLOCALE);
}

class FileContainer {

    constructor(fileroot, filepath = '/') {
        if (!fileroot) {
            throw new Error('Directory is not defined')
        }
        this.filepath = filepath;
        this.fileroot = fileroot;
        this.files = {};
        debug(`Using directory "${this.fileroot}" to store files`);
        this.readDirectorySync();
    }

    readDirectorySync() {
        const dir = fs.opendirSync(this.fileroot);
        let dirent;
        const files = {};
        while ((dirent = dir.readSync()) !== null) {
            if (dirent.name.startsWith('.')) {
                continue;
            }
            const fsStats = fs.statSync(`${this.fileroot}/${dirent.name}`);
            files[dirent.name] = { filepath: this.filepath, birthtime: fsStats.birthtimeMs, size: fsStats.size, hbirthTime: moment(fsStats.birthtimeMs).format('MMMM YYYY') };
        }
        dir.closeSync();
        const orderedFiles = {};
        Object.keys(files).sort().forEach(function(key) {
            orderedFiles[key] = files[key];
        });
        this.files = orderedFiles;
        return this.files;
    }

    async readDirectory() {
        const files = {};
        const dir = await fs.promises.opendir(this.fileroot);
        for await (const dirent of dir) { //@TODO: DRY with readDirectorySync()
            if (dirent.name.startsWith('.')) {
                continue;
            }
            const fsStats = fs.statSync(`${this.fileroot}/${dirent.name}`);
            files[dirent.name] = { filepath: this.filepath, birthtime: fsStats.birthtimeMs, size: fsStats.size, hbirthTime: moment(fsStats.birthtimeMs).format('MMMM YYYY') };
        }
        const orderedFiles = {};
        Object.keys(files).sort().forEach(function(key) {
            orderedFiles[key] = files[key];
        });
        this.files = orderedFiles;
        return Promise.resolve(this.files);
    }

    getFiles(readDirectory = false) {
        if (readDirectory) return this.readDirectorySync();
        else return this.files;
    }

    async deleteFile(name) {
        await fs.promises.unlink(`${this.fileroot}/${name}`);
        return this.readDirectory();
    }
}

module.exports = FileContainer;