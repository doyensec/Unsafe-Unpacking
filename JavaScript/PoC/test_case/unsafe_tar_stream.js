const fs = require('fs');
const tar = require('tar-stream');
const path = require('path');
// const tar = require('tar')
const gunzip = require('gunzip-maybe');

function safe_untar(file_name, output_dir) {
    const extract = tar.extract();

    extract.on('entry', (header, stream, next) => {
        const filePath = path.join(output_dir, path.basename(header.name));
        stream.pipe(fs.createWriteStream(filePath));
        stream.on('end', next);
        stream.resume();
    });

    fs.createReadStream(file_name).pipe(extract);
}

function safe_untar3(file_name, output_dir) {
    const extract = tar.extract();

    extract.on('entry', (header, stream, next) => {
        const outputPath = path.normalize(output_dir + "/" + header.name);
        if (outputPath.startsWith(output_dir)) {
            stream.pipe(fs.createWriteStream(outputPath));
        } else {
            console.log("Invalid entry name")
        }
        stream.on('end', next);
        stream.resume();
    });

    fs.createReadStream(file_name).pipe(extract);
}

function unsafe_untar(file_name, output_dir) {
    const extract = tar.extract();

    extract.on('entry', (header, stream, next) => {
        const filePath = path.join(output_dir, header.name);
        stream.pipe(fs.createWriteStream(filePath));
        stream.on('end', next);
        stream.resume();
    });

    fs.createReadStream(file_name).pipe(extract);
}

function unsafe_untar2(tarballPath, outputDir) {
    const extract = tar.extract();
  
    extract.on('entry', (header, stream, next) => {
      const filePath = path.join(outputDir, header.name);
      const outStream = fs.createWriteStream(filePath);
    });
  
    const tarballStream = fs.createReadStream(tarballPath)
      .pipe(gunzip())
      .pipe(extract);
}

safe_untar3('../payloads/payload.tar', '/Users/michael/Doyensec/Research/SemgrepSlip/JavaScript/PoC/test')

