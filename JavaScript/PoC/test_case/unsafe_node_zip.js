const fs = require('fs');
const unzip = require('node-zip');
const NodeZip = require('node-zip')
const path = require('path')

function safe_unzip(zipFilePath, outputDir) {
    const data = fs.readFileSync(zipFilePath);
    const zip = unzip(data);

    // Iterate over each file in the zip
    for (const fileName in zip.files) {
        const file = zip.files[fileName];
        const outputPath = outputDir + "/" + path.basename(fileName);
        fs.writeFileSync(outputPath, file.asNodeBuffer());
    }
}

function safe_unzip2(zipFilePath, outputDir) {
    const data = fs.readFileSync(zipFilePath);
    const zip = unzip(data);

    for (const fileName in zip.files) {
        const file = zip.files[fileName];
        const outputPath = path.normalize(outputDir + "/" + fileName);
        if (outputPath.startsWith(outputDir)) {
            fs.writeFileSync(outputPath, file.asNodeBuffer());
        } else {
            console.log("Invalid entry name")
        }
        
    }
}

function unzipFile2(zipFilePath, outputDir) {
    const data = fs.readFileSync(zipFilePath);
    const zip = unzip(data);
    files = zip.files

    // Iterate over each file in the zip
    for (const fileName in files) {
        const file = zip.files[fileName];
        fs.writeFileAsync(outputDir + "/" + fileName, file.asNodeBuffer());
    }
}

function unzipFile3(zipFilePath, outputDir) {
    const data = fs.readFileSync(zipFilePath);
    const zip = unzip(data);
    files = zip.files

    // Iterate over each file in the zip
    for (const fileName in files) {
        const file = zip.files[fileName];
        path = `${outputDir}/${fileName}`
        fs.writeFileSync(path, file.asNodeBuffer());
    }
}

function unzipFile4(zipFilePath, outputDir) {
    const data = fs.readFileSync(zipFilePath);
    const zip = unzip(data);

    Object.keys(zip.files).forEach((fileName) => {
        const file = zip.files[fileName];
        fs.writeFileSync(fileName, file.asNodeBuffer());
    })
}

function unzipFile5(zipFilePath, outputDir) {
    const data = fs.readFileSync(zipFilePath);
    const zip = new NodeZip(data)

    Object.keys(zip.files).forEach((fileName) => {
        const file = zip.files[fileName];
        
        fs.writeFileSync(fileName, file.asNodeBuffer());
    })
}



function unzipFile6(zipFilePath, outputDir) {
    const data = fs.readFileSync(zipFilePath);
    const zip = new NodeZip(data)

    Object.keys(zip.files).forEach((fileName) => {
        const file = zip.files[fileName];
        const outputPath = path.join(outputDir, fileName);
        if (outputPath.startsWith(path.resolve(outputDir))) {
            fs.writeFileSync(outputPath, file.asNodeBuffer());
        }        
    })
}

safe_unzip2('../payloads/payload.zip', '/Users/michael/Doyensec/Research/SemgrepSlip/JavaScript/PoC/test')