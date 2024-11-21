const zl = require("zip-lib");
const fs = require('fs');

function unzipFile(zipFilePath, outputDir) {
    zl.extract(zipFilePath, outputDir).then(function () {
        console.log("done");
    }, function (err) {
        console.log(err);
    });
}

zip_file_path = "../payloads/payload.zip"
destination_folder = '../safe_src/'

unzipFile(zip_file_path, destination_folder)