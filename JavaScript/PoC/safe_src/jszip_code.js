const JSZip = require("jszip");
const fs = require("fs");

fs.readFile("../payloads/payload.zip", (err, data) => {
    JSZip.loadAsync(data).then(zip => {
        Object.keys(zip.files).forEach(filename => {
            zip.files[filename].async("nodebuffer").then(content => {
                fs.writeFileSync(filename, content);
            });
        });
    });
});