const fs = require('fs');
const tar = require('tar-stream');
const path = require('path');
const gunzip = require('gunzip-maybe');

function safe_untar(file_name, output_dir) {
    // good
    const extract = tar.extract();

    extract.on('entry', (header, stream, next) => {
        const filePath = path.join(output_dir, path.basename(header.name));
        // fp
        // ruleid: tarstream_unsafe_unpacking
        stream.pipe(fs.createWriteStream(filePath));
        stream.on('end', next);
        stream.resume();
    });

    fs.createReadStream(file_name).pipe(extract);
}

function safe_untar1(file_name, output_dir) {
    // good
    const extract = tar.extract();

    extract.on('entry', (header, stream, next) => {
        const outputPath = path.normalize(output_dir + "/" + header.name);
        if (outputPath.startsWith(output_dir)) {
            // fp
            // ruleid: tarstream_unsafe_unpacking
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
    // bad
    const extract = tar.extract();

    extract.on('entry', (header, stream, next) => {
        const filePath = path.join(output_dir, header.name);
        // ruleid: tarstream_unsafe_unpacking
        stream.pipe(fs.createWriteStream(filePath));
        stream.on('end', next);
        stream.resume();
    });

    fs.createReadStream(file_name).pipe(extract);
}

function unsafe_untar1(tarballPath, outputDir) {
    // bad
    const extract = tar.extract();
  
    extract.on('entry', (header, stream, next) => {
      const filePath = path.join(outputDir, header.name);
      // ruleid: tarstream_unsafe_unpacking
      const outStream = fs.createWriteStream(filePath);
      stream.pipe(outStream);
      stream.on('end', next);
      stream.resume();
    });
  
    const tarballStream = fs.createReadStream(tarballPath)
      .pipe(gunzip())
      .pipe(extract);
}

tar_file_path = "../payloads/payload.tar"
destination_folder = '../src/'

unsafe_unzip(tar_file_path, destination_folder)