const StreamZip = require('node-stream-zip');

function unzipUsingStreamZip(filePath, outputDir) {
    const zip = new StreamZip.async({ file: filePath });

    zip.entries().then((entries) => {
        Object.keys(entries).forEach((entry) => {
            const entryPath = `${outputDir}/${entry}`;
            zip.extract(entry, entryPath);
        });
    }).catch(err => console.error('Error:', err));
}

zip_file_path = "../payloads/payload.zip"
destination_folder = '../safe_src/'

unzipUsingStreamZip(zip_file_path, destination_folder)