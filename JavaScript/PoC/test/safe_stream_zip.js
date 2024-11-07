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

unzipUsingStreamZip('../payloads/payload.zip', '/Users/michael/Doyensec/Research/SemgrepSlip/JavaScript/PoC/test/');
