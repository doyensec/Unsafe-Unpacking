const yauzl = require('yauzl');
const fs = require('fs');
const path = require('path')

function unzip1(filePath, outputDir) {
    yauzl.open(filePath, { lazyEntries: true }, (err, zipfile) => {
        if (err) throw err;

        zipfile.readEntry();
        zipfile.on('entry', (entry) => {
            console.log(entry.fileName)
            zipfile.openReadStream(entry, (err, readStream) => {
                if (err) throw err;
                readStream.pipe(fs.createWriteStream(outputDir+entry.fileName));
                readStream.on('end', () => zipfile.readEntry());
            });
        });

        zipfile.on('end', () => console.log('Extraction complete.'));
    });
}

function unzip2(zipFilePath, outputDir) {
    yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
        if (err) throw err;

        zipfile.readEntry();

        zipfile.on('entry', (entry) => {
            const outputPath = path.join(outputDir, entry.fileName);

            if (entry.isDirectory) {
                fs.ensureDirSync(outputPath);
                zipfile.readEntry();
            } else {
                zipfile.openReadStream(entry, (err, readStream) => {
                    if (err) throw err;
                    readStream.pipe(fs.createWriteStream(outputPath)).on('finish', () => {
                        zipfile.readEntry();
                    });
                });
            }
        });

        zipfile.on('end', () => console.log('Extraction complete'));
    });
}


unzip1('../payloads/payload_good.zip', '/Users/michael/Doyensec/Research/SemgrepSlip/JavaScript/PoC/test/');
