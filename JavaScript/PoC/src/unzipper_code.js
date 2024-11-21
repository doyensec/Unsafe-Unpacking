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
            // ruleid: unzipper_unsafe_unpacking
            entry.pipe(fs.createWriteStream(filePath));
        })
}

function unsafe_unzip1(file_name, output_dir) {
    // bad
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzipper.Parse())
        .on('entry', function (entry) {
            // ruleid: unzipper_unsafe_unpacking
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
            // ruleid: unzipper_unsafe_unpacking
            entry.pipe(fs.createWriteStream(fileName));
        });
}

function unsafe_unzip3(file_name, output_dir) {
    // bad
    fs.readFile(file_name, function (err, zipContents) {
        unzipper.Parse(zipContents).on('entry', function (entry) {
            var fileName = entry.path;
            // ruleid: unzipper_unsafe_unpacking
            fs.writeFileSync(fileName, entry.contents);
        });
    });

}

function unsafe_unzip4(fileName, output_dir) {
    fs.mkdirSync(output_dir, { recursive: true });

    const readStream = fs.createReadStream(fileName);
    const unzipStream = unzipper.Parse();

    readStream.on('data', chunk => unzipStream.write(chunk));
    unzipStream.on('entry', entry => {
        const writeStream = fs.createWriteStream(`${output_dir}/${entry.path}`);
        
        // ruleid: unzipper_unsafe_unpacking
        entry.on('data', data => writeStream.write(data));
    });
}

zip_file_path = "../payloads/payload.zip"
destination_folder = '../src/'

unsafe_unzip(zip_file_path, destination_folder)