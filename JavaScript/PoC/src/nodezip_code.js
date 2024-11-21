const fs = require('fs');
const unzip = require('node-zip');
const NodeZip = require('node-zip')
const path = require('path')

function safe_unzip(zipFilePath, outputDir) {
    // good
    const data = fs.readFileSync(zipFilePath);
    const zip = unzip(data);

    // Iterate over each file in the zip
    for (const fileName in zip.files) {
        const file = zip.files[fileName];
        const outputPath = outputDir + "/" + path.basename(fileName);
        // fp
        fs.writeFileSync(outputPath, file.asNodeBuffer());
    }
}

function safe_unzip1(zipFilePath, outputDir) {
    // good
    const data = fs.readFileSync(zipFilePath);
    const zip = unzip(data);

    for (const fileName in zip.files) {
        const file = zip.files[fileName];
        const outputPath = path.normalize(outputDir + "/" + fileName);
        if (outputPath.startsWith(outputDir)) {
            // fp
            fs.writeFileSync(outputPath, file.asNodeBuffer());
        } else {
            console.log("Invalid entry name")
        }
        
    }
}

function unsafe_unzip(zipFilePath, outputDir) {
    // bad
    const data = fs.readFileSync(zipFilePath);
    const zip = unzip(data);
    files = zip.files

    // Iterate over each file in the zip
    for (const fileName in files) {
        const file = zip.files[fileName];
        // ruleid: node_zip_unsafe_unpacking
        fs.writeFileAsync(outputDir + "/" + fileName, file.asNodeBuffer());
    }
}

function unsafe_unzip1(zipFilePath, outputDir) {
    // bad
    const data = fs.readFileSync(zipFilePath);
    const zip = unzip(data);
    files = zip.files

    // Iterate over each file in the zip
    for (const fileName in files) {
        const file = zip.files[fileName];
        path = `${outputDir}/${fileName}`
        // ruleid: node_zip_unsafe_unpacking
        fs.writeFileSync(path, file.asNodeBuffer());
    }
}

function unsafe_unzip2(zipFilePath, outputDir) {
    // bad
    const data = fs.readFileSync(zipFilePath);
    const zip = unzip(data);

    Object.keys(zip.files).forEach((fileName) => {
        const file = zip.files[fileName];
        // ruleid: node_zip_unsafe_unpacking
        fs.writeFileSync(fileName, file.asNodeBuffer());
    })
}

function unsafe_unzip3(zipFilePath, outputDir) {
    // bad
    const data = fs.readFileSync(zipFilePath);
    const zip = new NodeZip(data)

    Object.keys(zip.files).forEach((fileName) => {
        const file = zip.files[fileName];
        // ruleid: node_zip_unsafe_unpacking
        fs.writeFileSync(fileName, file.asNodeBuffer());
    })
}

function unsafe_unzip4(zipFilePath, outputDir) {
    // bad
    const data = fs.readFileSync(zipFilePath);
    const zip = new NodeZip(data)

    Object.keys(zip.files).forEach((fileName) => {
        const file = zip.files[fileName];
        const outputPath = path.join(outputDir, fileName);
        if (outputPath.startsWith(path.resolve(outputDir))) {
            // ruleid: node_zip_unsafe_unpacking
            fs.writeFileSync(outputPath, file.asNodeBuffer());
        }        
    })
}

zip_file_path = "../payloads/payload.zip"
destination_folder = '../src/'

unsafe_unzip(zip_file_path, destination_folder)