const fs = require('fs');
const AdmZip = require('adm-zip');
const path = require('path');


function safe_unzip(file_name, output_dir) {
    fs.mkdirSync(output_dir, { recursive: true });
    const zip = new AdmZip(file_name);
    zip.extractAllTo(output_dir, true); 
}

function unsafe_unzip(file_name, output_dir) {
    var zip = new AdmZip(file_name);
    var zipEntries = zip.getEntries();
    zipEntries.forEach(function (zipEntry) {
        fs.createWriteStream(zipEntry.entryName);
    });
}

function unsafe_unzip(file_name, output_dir) {
    var zip = new AdmZip(file_name);
    zip.getEntries().forEach(function (zipEntry) {
        fs.createWriteStream(zipEntry.entryName);
    });
}


function unsafe_unzip1(file_name, output_dir) {
    var zip = new AdmZip(file_name);
    var zipEntries = zip.getEntries();
    zipEntries.forEach(function (zipEntry) {
        fs.createWriteStream(output_dir+zipEntry.entryName);
    });
}

function unsafe_unzip2(file_name, output_dir) {
    var zip = new AdmZip(file_name);
    var zipEntries = zip.getEntries();
    zipEntries.forEach(function (zipEntry) {
        fs.createWriteStream(output_dir+zipEntry.entryName);
    });
}

function unsafe_unzip3(file_name, output_dir) {
    var zip = new AdmZip(file_name);
    var zipEntries = zip.getEntries();
    zipEntries.forEach(zipEntry => {
        const filePath = path.join(output_dir, zipEntry.entryName);
        fs.createWriteStream(filePath);
    });
}

function unsafe_unzip4(file_name, output_dir) {
    const zip = new AdmZip(file_name);
    const zipEntries = zip.getEntries();

    for (const entry of zipEntries) {
        const filePath = path.join(output_dir, entry.entryName);
        fs.createWriteStream(filePath);
    }
}


// Example usage
safe_unzip('../payloads/payload.zip', '/Users/michael/Doyensec/Research/SemgrepSlip/JavaScript/PoC/test/');
