//Ref: https://snyk.io/research/zip-slip-vulnerability
const fs = require('fs');
const unzip = require('unzip');


//fs.createReadStream('../payloads/payload_good.zip')
//    .pipe(unzip.Parse())
//    .on('entry', entry => {
//        const fileName = entry.path;
        // Arbitrary file overwrite
        // ruleid:zip_path_overwrite
//        entry.pipe(fs.createWriteStream(fileName));
//    });

function unzipFile1(zipFilePath, outputDir) {
    // Create output directory if it doesn't exist
    fs.mkdirSync(outputDir, { recursive: true });

    fs.createReadStream(zipFilePath)
        .pipe(unzip.Extract({ path: outputDir }))
        .on('close', () => {
            console.log('Unzip complete!');
        })
        .on('error', (err) => {
            console.error('Error while unzipping:', err);
        });
}



function unzipFile(zipFilePath, outputDir) {
    // Create output directory if it doesn't exist
    fs.mkdirSync(outputDir, { recursive: true });

    fs.createReadStream(zipFilePath)
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            const filePath = `${outputDir}/${entry.path}`;
            entry.pipe(fs.createWriteStream(filePath));
            console.log(`Extracting: ${filePath}`);
        })
        .on('close', () => {
            console.log('Unzip complete!');
        })
        .on('error', (err) => {
            console.error('Error while unzipping:', err);
        });
}

unzipFile('../payloads/payload.zip', '/Users/michael/Doyensec/Research/SemgrepSlip/JavaScript/PoC/test');
