const zl = require("zip-lib");
const fs = require('fs');

function unzipFile(zipFilePath, outputDir) {
    zl.extract(zipFilePath, outputDir).then(function () {
        console.log("done");
    }, function (err) {
        console.log(err);
    });
}

// Example usage
unzipFile('../payloads/payload.zip', '/Users/michael/Doyensec/Research/SemgrepSlip/JavaScript/PoC/test')