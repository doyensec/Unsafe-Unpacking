const fs = require('fs');
const unzip = require('unzip');

function safe_unzip(file_name, output_dir) {
    // good
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzip.Extract({ path: output_dir}))
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
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            const filePath = `${output_dir}/${entry.path}`;
            // ruleid: unzip_unsafe_unpacking
            entry.pipe(fs.createWriteStream(filePath));
        })
}

function unsafe_unzip1(file_name, output_dir) {
    // bad
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzip.Parse())
        .on('entry', entry => {
            const fileName = entry.path;
            // ruleid: unzip_unsafe_unpacking
            entry.pipe(fs.createWriteStream(fileName));
        });
}

function unsafe_unzip2(file_name, output_dir) {
    // bad
    fs.readFile(file_name, function (err, zipContents) {
        unzip.Parse(zipContents).on('entry', function (entry) {
            var fileName = entry.path;

            // ruleid: unzip_unsafe_unpacking
            fs.writeFileSync(fileName, entry.contents);
        });
    });

}

function unsafe_unzip3(fileName, output_dir) {
    fs.mkdirSync(output_dir, { recursive: true });

    const readStream = fs.createReadStream(fileName);
    const unzipStream = unzip.Parse();

    readStream.on('data', chunk => unzipStream.write(chunk));
    unzipStream.on('entry', entry => {
        // ruleid: unzip_unsafe_unpacking
        const writeStream = fs.createWriteStream(`${output_dir}/${entry.path}`);
        
        entry.on('data', data => writeStream.write(data));
    });
}

zip_file_path = "../payloads/payload.zip"
destination_folder = '../src/'

unsafe_unzip(zip_file_path, destination_folder)