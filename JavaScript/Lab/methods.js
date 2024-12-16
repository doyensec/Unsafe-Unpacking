const fs = require('fs');
const AdmZip = require('adm-zip');
const path = require('path');
const NodeZip = require('node-zip')
const tar = require('tar-stream');
const unzipper = require('unzipper');
const unzip = require('unzip');

function unsafe_admzip(file_name, output_dir) {
    // bad
    const zip = new AdmZip(file_name);
    const zipEntries = zip.getEntries();

    for (const entry of zipEntries) {
        const filePath = path.join(output_dir, entry.entryName);
        fs.createWriteStream(filePath);
    }
}

function safe_admzip(file_name, output_dir) {
    // good
    fs.mkdirSync(output_dir, { recursive: true });
    const zip = new AdmZip(file_name);
    zip.extractAllTo(output_dir, true); 
}

function unsafe_unzipper(file_name, output_dir) {
    // bad
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzipper.Parse())
        .on('entry', entry => {
            const path = `${output_dir}/${entry.path}`;
            entry.pipe(fs.createWriteStream(path));
        });
}

function safe_unzipper(file_name, output_dir) {
    // good
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzipper.Extract({ path: output_dir }));
}

function unsafe_nodezip(zipFilePath, outputDir) {
    // bad
    const data = fs.readFileSync(zipFilePath);
    const zip = new NodeZip(data);

    Object.keys(zip.files).forEach((fileName) => {
        const file = zip.files[fileName];
        fs.writeFileSync(path.join(outputDir, fileName), file.asNodeBuffer());
    });
}

function safe_nodezip(zipFilePath, outputDir) {
    // good
    const data = fs.readFileSync(zipFilePath);
    const zip = new NodeZip(data);

    Object.keys(zip.files).forEach((fileName) => {
        const file = zip.files[fileName];
        const outputPath = path.join(outputDir, fileName);
        if (outputPath.startsWith(path.resolve(outputDir))) {
            fs.writeFileSync(outputPath, file.asNodeBuffer());
        }
    });
}

function unsafe_unzip(file_name, output_dir) {
    // bad
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzip.Parse())
        .on('entry', entry => {
            const fileName = entry.path;
            entry.pipe(fs.createWriteStream(path.join(output_dir, fileName)));
        });
}

function safe_unzip(file_name, output_dir) {
    // good
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzip.Extract({ path: output_dir }));
}

function unsafe_untar(file_name, output_dir) {
    // bad
    const extract = tar.extract();

    extract.on('entry', (header, stream, next) => {
        const filePath = path.join(output_dir, header.name);
        stream.pipe(fs.createWriteStream(filePath));
        stream.on('end', next);
        stream.resume();
    });

    fs.createReadStream(file_name).pipe(extract);
}

function safe_untar(file_name, output_dir) {
    // good
    const extract = tar.extract();

    extract.on('entry', (header, stream, next) => {
        const filePath = path.join(output_dir, path.basename(header.name));
        stream.pipe(fs.createWriteStream(filePath));
        stream.on('end', next);
        stream.resume();
    });

    fs.createReadStream(file_name).pipe(extract);
}

module.exports = { unsafe_admzip, unsafe_nodezip, unsafe_untar, unsafe_unzip, unsafe_unzipper, safe_admzip, safe_nodezip, safe_untar, safe_unzip, safe_unzipper }; // Export the method
