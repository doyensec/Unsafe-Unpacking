const fs = require('fs');
const unzipper = require('unzipper');

function safe_unzip(file_name, output_dir) {
    // good
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzipper.Extract({ path: output_dir}))
        .on('close', () => {
            console.log('Unzip complete!');
        })
        .on('error', (err) => {
            console.error('Error while unzipping:', err);
        });
}

function unsafe_unzip(file_name, output_dir) {
    // bad
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzipper.Parse())
        .on('entry', function (entry) {
            const filePath = `${output_dir}/${entry.path}`;
            entry.pipe(fs.createWriteStream(filePath));
        })
}

function unsafe_unzip3(file_name, output_dir) {
    // bad
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzipper.Parse())
        .on('entry', function (entry) {
            entry.pipe(fs.createWriteStream(`${output_dir}/${entry.path}`));
        })
}

function unsafe_unzip2(file_name, output_dir) {
    // bad
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzipper.Parse())
        .on('entry', entry => {
            const fileName = entry.path;
            entry.pipe(fs.createWriteStream(fileName));
        });
}

function unsafe_unzip5(file_name, output_dir) {
    // bad
    fs.readFile(file_name, function (err, zipContents) {
        unzipper.Parse(zipContents).on('entry', function (entry) {
            var fileName = entry.path;
            // Arbitrary file overwrite
            // ruleid:zip_path_overwrite2

            // i dont know how is this exploitable
            fs.writeFileSync(fileName, entry.contents);
        });
    });

}

function unsafe_unzip6(fileName, output_dir) {
    fs.mkdirSync(output_dir, { recursive: true });

    const readStream = fs.createReadStream(fileName);
    const unzipStream = unzipper.Parse();

    readStream.on('data', chunk => unzipStream.write(chunk));
    unzipStream.on('entry', entry => {
        const writeStream = fs.createWriteStream(`${output_dir}/${entry.path}`);
        
        // writes the content
        // I assume that it is not necessary this
        entry.on('data', data => writeStream.write(data));
    });
}

safe_unzip('../payloads/payload_good.zip', '/Users/michael/Doyensec/Research/SemgrepSlip/JavaScript/PoC/test/');
