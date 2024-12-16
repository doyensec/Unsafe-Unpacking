# JavaScript Decompression Attacks

| Library    | Has default extract method | User implementation may be vulnerable  | NPM page                                      |
|------------|----------------------------------|--------------------------------------|--------------------------------------------------|
| AdmZip     | True                                 | True                                     | [AdmZip](https://www.npmjs.com/package/adm-zip)  |
| unzipper   | True                                 | True                                     | [unzipper](https://www.npmjs.com/package/unzipper) |
| unzip      | True                                 | True                                     | [unzip](https://www.npmjs.com/package/unzip) |
| yauzl      | False                                | False                                     | [yauzl](https://www.npmjs.com/package/yauzl) |
| node-stream| True                                 | False                                     | [node-stream-zip](https://www.npmjs.com/package/node-stream-zip) |
| JSZip      | False                                 | False                                      | [JSZip](https://www.npmjs.com/package/jszip)          |
| zip-lib    | True                                 | False                                     | [zip-lib](https://www.npmjs.com/package/zip-lib) |
| node-zip   | False                                 | True                                     | [node-zip](https://www.npmjs.com/package/node-zip) |
| tar        | False                                 | True                                     | [tar](https://www.npmjs.com/package/tar-stream)                |

## Introduction

There are many libraries used for decompressing archives in JavaScript, such as `admzip`, `unzipper`, `unzip`, `JSZip`, `yauzl`, `node-zip`, `zip-lib` and `tar`.

## Unsafe Usages

The following libraries allow the programmer to implement the extraction themselves using `fs.createWriteStream()`, `fs.writeFile()`, `fs.writeFileSync()`, `fs.appendFile()`, or `fs.appendFileSync()`.

The programmer can iterate through the entries and use the previously mentioned methods to extract the content of the entries. This makes the programmer responsible for sanitizing and validating all the filenames of the entries to prevent path injection.

The following code snippets demonstrate the **VULNERABLE** usage of each library:

### [AdmZip](https://www.npmjs.com/package/adm-zip)

```js
function unsafe_unzip(file_name, output_dir) {
    // bad
    var zip = new AdmZip(file_name);
    var zipEntries = zip.getEntries();
    zipEntries.forEach(function (zipEntry) {
        filePath = output_dir + zipEntry.entryName; // [!] /path/to/output/ + ../../bad 
        fs.createWriteStream(filePath); 
    });
}
```

### [Unzipper](https://www.npmjs.com/package/unzipper)

```js
function unsafe_unzip(file_name, output_dir) {
    // bad
    fs.createReadStream(file_name)
        .pipe(unzipper.Parse())
        .on('entry', function (entry) {
            const filePath = `${output_dir}/${entry.path}`; // [!] /path/to/output/ + ../../bad 
            entry.pipe(fs.createWriteStream(filePath));
        })
}
```

### [Node-zip](https://www.npmjs.com/package/node-zip)

```js
function unzipFile2(file_name, outputDir) {
    // bad
    const data = fs.readFileSync(file_name);
    const zip = unzip(data);
    files = zip.files

    for (const fileName in files) {
        const file = zip.files[fileName];
        fs.writeFileAsync(outputDir + "/" + fileName, file.asNodeBuffer()); // [!] /path/to/output/ + ../../bad 
    }
}
```

### [Unzip](https://www.npmjs.com/package/unzip)

```js
function unsafe_unzip(file_name, output_dir) {
    // bad
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            const filePath = `${output_dir}/${entry.path}`; // [!] /path/to/output/ + ../../bad 
            entry.pipe(fs.createWriteStream(filePath));
        })
}
```

### [Tar-stream](https://www.npmjs.com/package/tar-stream)

```js
function unsafe_untar(file_name, output_dir) {
    const extract = tar.extract();

    extract.on('entry', (header, stream, next) => {
        const filePath = path.join(output_dir, header.name); // [!] /path/to/output/ + ../../bad 
        stream.pipe(fs.createWriteStream(filePath));
        stream.on('end', next);
        stream.resume();
    });

    fs.createReadStream(file_name).pipe(extract);
}
```

## Safe Usages

Some libraries offer methods that validate and sanitize the path, while others require the programmer to handle the validation themselves.

The following code snippets demonstrate how to properly implement archive extraction:

### [Yauzl](https://www.npmjs.com/package/yauzl)

The `readEntry()` method throws an error if it encounters an invalid relative path.

```js
function safe_unzip(filePath, outputDir) {
    // good
    yauzl.open(filePath, { lazyEntries: true }, (err, zipfile) => {
        if (err) throw err;

        zipfile.readEntry(); 
        zipfile.on('entry', (entry) => {
            console.log(entry.fileName)
            zipfile.openReadStream(entry, (err, readStream) => {
                if (err) throw err;
                readStream.pipe(fs.createWriteStream(outputDir + entry.fileName));
                readStream.on('end', () => zipfile.readEntry());
            });
        });

        zipfile.on('end', () => console.log('Extraction complete.'));
    });
}
```

### [JSZip](https://www.npmjs.com/package/jszip)

`JSZip.loadAsync()` sanitizes the path then the value of filename will not contain redundant dots and separators.

```js
function safe_unzip(filePath, outputDir) {
    // good
    fs.readFile(filePath, (err, data) => {
        JSZip.loadAsync(data).then(zip => {
            Object.keys(zip.files).forEach(filename => {
                zip.files[filename].async("nodebuffer").then(content => {
                    filePath = outputDir + filename;
                    fs.writeFileSync(filename, content);
                });
            });
        });
    });
}
```

### [Node-stream-zip](https://www.npmjs.com/package/node-stream-zip)

If a malicious entry is present during the initialization of `new StreamZip.async({ file: filePath })`, an error will be thrown.

```js
function safe_unzip(filePath, outputDir) {
    // good
    const zip = new StreamZip.async({ file: filePath });

    zip.entries().then((entries) => {
        Object.keys(entries).forEach((entry) => {
            const entryPath = `${outputDir}/${entry}`;
            zip.extract(entry, entryPath);
        });
    }).catch(err => console.error('Error:', err));
}
```

### [Zip-lib](https://www.npmjs.com/package/zip-lib)

The `zip-lib.extract()` method throws an error if it encounters an invalid relative path.

```js
function safe_unzip(zipFilePath, outputDir) {
    // good
    zl.extract(zipFilePath, outputDir).then(function () {
        console.log("done");
    }, function (err) {
        console.log(err);
    });
}
```

### [AdmZip](https://www.npmjs.com/package/adm-zip)

The `AdmZip().extractAllTo()` method sanitizes the entry filename preventing path injection.

```js
function safe_unzip(file_name, output_dir) {
    fs.mkdirSync(output_dir, { recursive: true });
    const zip = new AdmZip(file_name);
    zip.extractAllTo(output_dir, true); 
}
```

### [Unzipper](https://www.npmjs.com/package/unzipper)

The `unzipper.Extract()` skips the extraction of all those entries with invalid filenames.

```js
function safe_unzip(file_name, output_dir) {
    // good
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzipper.Extract({ path: output_dir}))
        .on('close', () => {
            console.log('Unzip complete!');
        });
}
```

### [Node-zip](https://www.npmjs.com/package/node-zip)

There are two ways to mitigate the problem:

#### Using `path.basename`

Use `path.basename` to remove redundant dots and slashes from the entry filename:

```js
function safe_unzip(zipFilePath, outputDir) {
    // good
    const data = fs.readFileSync(zipFilePath);
    const zip = unzip(data);

    // Iterate over each file in the zip
    for (const fileName in zip.files) {
        const file = zip.files[fileName];
        const outputPath = outputDir + "/" + path.basename(fileName);
        fs.writeFileSync(outputPath, file.asNodeBuffer());
    }
}
```

#### Output Path is within Output Directory

The `path.normalize()` method simplifies the provided path by removing redundant segments. For example, it converts a path like `/1/2/3/../entry` to `/1/2/entry`, effectively resolving any `..` segments that point to the parent directory.

Using `startsWith()` we can ensure that output path must be within output dir to be extracted.

```js
function safe_unzip(zipFilePath, outputDir) {
    const data = fs.readFileSync(zipFilePath);
    const zip = unzip(data);

    for (const fileName in zip.files) {
        const file = zip.files[fileName];
        const outputPath = path.normalize(outputDir + "/" + fileName);
        if (outputPath.startsWith(outputDir)) {
            fs.writeFileSync(outputPath, file.asNodeBuffer());
        } else {
            console.log("Invalid entry name")
        }
        
    }
}
```


### [Unzip](https://www.npmjs.com/package/unzip)

The `unzip.Extract()` skips the extraction of all those entries with invalid filenames.

```js
function safe_unzip(file_name, output_dir) {
    // good
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzip.Extract({ path: output_dir}))
        .on('close', () => {
            console.log('Unzip complete!');
        })
}
```

### [Tar-stream](https://www.npmjs.com/package/tar-stream)

There are two ways to mitigate the problem:

#### Using `path.basename`

Use `path.basename` to remove redundant dots and slashes from the entry filename:

```js
function safe_untar(file_name, output_dir) {
    const extract = tar.extract();

    extract.on('entry', (header, stream, next) => {
        const filePath = path.join(output_dir, path.basename(header.name));
        stream.pipe(fs.createWriteStream(filePath));
        stream.on('end', next);
        stream.resume();
    });

    fs.createReadStream(file_name).pipe(extract);
}
```

#### Output Path is within Output Directory

The `path.normalize()` method simplifies the provided path by removing redundant segments. For example, it converts a path like `/1/2/3/../entry` to `/1/2/entry`, effectively resolving any `..` segments that point to the parent directory.

Using `startsWith()` we can ensure that output path must be within output dir to be extracted.

```js
function safe_untar3(file_name, output_dir) {
    const extract = tar.extract();

    extract.on('entry', (header, stream, next) => {
        const outputPath = path.normalize(output_dir + "/" + header.name);
        if (outputPath.startsWith(output_dir)) {
            stream.pipe(fs.createWriteStream(outputPath));
        } else {
            console.log("Invalid entry name")
        }
        stream.on('end', next);
        stream.resume();
    });

    fs.createReadStream(file_name).pipe(extract);
}
```