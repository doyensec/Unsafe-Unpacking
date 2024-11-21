const fs = require('fs');
const unzip = require('unzip');

function unzipFile1(zipFilePath, outputDir) {
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

zip_file_path = "../payloads/payload.zip"
destination_folder = '../safe_src/'

unzipFile1(zip_file_path, destination_folder)