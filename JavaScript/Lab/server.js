const fs = require('fs');
const express = require('express');
const path = require('path');
const { unsafe_admzip, unsafe_nodezip, unsafe_untar, unsafe_unzip, unsafe_unzipper, safe_admzip, safe_nodezip, safe_untar, safe_unzip, safe_unzipper } = require("./methods");
const multer = require('multer');

const app = express();
const PORT = 3000;

app.use(express.static('templates'));
const upload = multer({ dest: 'uploads/' });


const currentDir = process.cwd();
const payloadsDir = path.join(__dirname, 'payloads/'); 
const archiveDir = path.join(__dirname, 'archive/'); 
// Serve the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.get('/run_unsafe_adm_zip', async (req, res) => {
    try {
        await unsafe_admzip(path.join(payloadsDir, 'payload.zip'), archiveDir);
        res.json({ "message": 'unpacked' });
    } catch (e) {
        console.log(e)
    }
});

app.post('/upload_1', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadedFilePath = req.file.path; // Temporary file path

    try {
        await unsafe_admzip(uploadedFilePath, archiveDir);
        fs.unlinkSync(uploadedFilePath);
        res.json({ "message": 'unpacked' });
    } catch (e) {

    }
});

app.get('/run_safe_adm_zip', async (req, res) => {
    try {
        await safe_admzip(path.join(payloadsDir, 'payload.zip'), archiveDir);
        res.json({ "message": 'unpacked' });
    } catch (e) {
        console.log(e)
    }
});

app.post('/upload_2', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadedFilePath = req.file.path; // Temporary file path

    try {
        await safe_admzip(uploadedFilePath, archiveDir);
        fs.unlinkSync(uploadedFilePath);
        res.json({ "message": 'unpacked' });
    } catch (e) {

    }
});

app.get('/run_unsafe_unzipper', async (req, res) => {
    try {
        await unsafe_unzipper(path.join(payloadsDir, 'payload.zip'), archiveDir);
        res.json({ "message": 'unpacked' });
    } catch (e) {
        console.log(e)
    }
});

app.post('/upload_3', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadedFilePath = req.file.path; // Temporary file path

    try {
        await unsafe_unzipper(uploadedFilePath, archiveDir);
        fs.unlinkSync(uploadedFilePath);
        res.json({ "message": 'unpacked' });
    } catch (e) {

    }
});


app.get('/run_safe_unzipper', async (req, res) => {
    try {
        await safe_unzipper(path.join(payloadsDir, 'payload.zip'), archiveDir);
        res.json({ "message": 'unpacked' });
    } catch (e) {
        console.log(e)
    }
});

app.post('/upload_4', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadedFilePath = req.file.path; // Temporary file path

    try {
        await safe_unzipper(uploadedFilePath, archiveDir);
        fs.unlinkSync(uploadedFilePath);
        res.json({ "message": 'unpacked' });
    } catch (e) {

    }
});

app.get('/run_unsafe_node_zip', async (req, res) => {
    try {
        await unsafe_nodezip(path.join(payloadsDir, 'payload.zip'), archiveDir);
        res.json({ "message": 'unpacked' });
    } catch (e) {
        console.log(e)
    }
});

app.post('/upload_5', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadedFilePath = req.file.path; // Temporary file path

    try {
        await unsafe_nodezip(uploadedFilePath, archiveDir);
        fs.unlinkSync(uploadedFilePath);
        res.json({ "message": 'unpacked' });
    } catch (e) {

    }
});

app.get('/run_safe_node_zip', async (req, res) => {
    try {
        await safe_nodezip(path.join(payloadsDir, 'payload.zip'), archiveDir);
        res.json({ "message": 'unpacked' });
    } catch (e) {
        console.log(e)
    }
});

app.post('/upload_6', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadedFilePath = req.file.path; // Temporary file path

    try {
        await safe_nodezip(uploadedFilePath, archiveDir);
        fs.unlinkSync(uploadedFilePath);
        res.json({ "message": 'unpacked' });
    } catch (e) {

    }
});


app.get('/run_unsafe_unzip', async (req, res) => {
    try {
        await unsafe_unzip(path.join(payloadsDir, 'payload.zip'), archiveDir);
        res.json({ "message": 'unpacked' });
    } catch (e) {
        console.log(e)
    }
});

app.post('/upload_7', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadedFilePath = req.file.path; // Temporary file path

    try {
        await unsafe_unzip(uploadedFilePath, archiveDir);
        fs.unlinkSync(uploadedFilePath);
        res.json({ "message": 'unpacked' });
    } catch (e) {

    }
});


app.get('/run_safe_unzip', async (req, res) => {
    try {
        await safe_unzip(path.join(payloadsDir, 'payload.zip'), archiveDir);
        res.json({ "message": 'unpacked' });
    } catch (e) {
        console.log(e)
    }
});

app.post('/upload_8', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadedFilePath = req.file.path; // Temporary file path

    try {
        await safe_unzip(uploadedFilePath, archiveDir);
        fs.unlinkSync(uploadedFilePath);
        res.json({ "message": 'unpacked' });
    } catch (e) {

    }
});


app.get('/run_unsafe_tar', async (req, res) => {
    try {
        await unsafe_untar(path.join(payloadsDir, 'payload.tar'), archiveDir);
        res.json({ "message": 'unpacked' });
    } catch (e) {
        console.log(e)
    }
});

app.post('/upload_9', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadedFilePath = req.file.path; // Temporary file path

    try {
        await unsafe_untar(uploadedFilePath, archiveDir);
        fs.unlinkSync(uploadedFilePath);
        res.json({ "message": 'unpacked' });
    } catch (e) {

    }
});


app.get('/run_safe_tar', async (req, res) => {
    try {
        await safe_untar(path.join(payloadsDir, 'payload.tar'), archiveDir);
        res.json({ "message": 'unpacked' });
    } catch (e) {
        console.log(e)
    }
});

app.post('/upload_10', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadedFilePath = req.file.path; // Temporary file path

    try {
        await safe_untar(uploadedFilePath, archiveDir);
        fs.unlinkSync(uploadedFilePath);
        res.json({ "message": 'unpacked' });
    } catch (e) {

    }
});

const sourceCodes = {
    1: `function unsafe_unzip(file_name, output_dir) {
    // bad
    const zip = new AdmZip(file_name);
    const zipEntries = zip.getEntries();

    for (const entry of zipEntries) {
        const filePath = path.join(output_dir, entry.entryName);
        fs.createWriteStream(filePath);
    }
}`,
    
    2: `function safe_unzip(file_name, output_dir) {
    // good
    fs.mkdirSync(output_dir, { recursive: true });
    const zip = new AdmZip(file_name);
    zip.extractAllTo(output_dir, true); 
}`,
    
    3: `function unsafe_unzip(file_name, output_dir) {
    // bad
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzipper.Parse())
        .on('entry', entry => {
            const path = \`\${output_dir}/\${entry.path}\`;
            entry.pipe(fs.createWriteStream(path));
        });
}`,
    
    4: `function safe_unzip(file_name, output_dir) {
    // good
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzipper.Extract({ path: output_dir }));
}`,
    
    5: `function unsafe_unzip(zipFilePath, outputDir) {
    // bad
    const data = fs.readFileSync(zipFilePath);
    const zip = new NodeZip(data);

    Object.keys(zip.files).forEach((fileName) => {
        const file = zip.files[fileName];
        fs.writeFileSync(path.join(outputDir, fileName), file.asNodeBuffer());
    });
}`,
    
    6: `function safe_unzip(zipFilePath, outputDir) {
    // good
    const data = fs.readFileSync(zipFilePath);
    const zip = new NodeZip(data);

    Object.keys(zip.files).forEach((fileName) => {
        const file = zip.files[fileName];
        const outputPath = path.join(outputDir, fileName);
        if (outputPath.startsWith(path.resolve(outputDir))) {
            fs.writeFileSync(outputPath, file.asNodeBuffer());
        }
    });
}`,
    
    7: `function unsafe_unzip(file_name, output_dir) {
    // bad
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzip.Parse())
        .on('entry', entry => {
            const fileName = entry.path;
            entry.pipe(fs.createWriteStream(path.join(output_dir, fileName)));
        });
}`,
    
    8: `function safe_unzip(file_name, output_dir) {
    // good
    fs.mkdirSync(output_dir, { recursive: true });

    fs.createReadStream(file_name)
        .pipe(unzip.Extract({ path: output_dir }));
}`,
    
    9: `function unsafe_untar(file_name, output_dir) {
    // bad
    const extract = tar.extract();

    extract.on('entry', (header, stream, next) => {
        const filePath = path.join(output_dir, header.name);
        stream.pipe(fs.createWriteStream(filePath));
        stream.on('end', next);
        stream.resume();
    });

    fs.createReadStream(file_name).pipe(extract);
}`,
    
    10: `function safe_untar(file_name, output_dir) {
    // good
    const extract = tar.extract();

    extract.on('entry', (header, stream, next) => {
        const filePath = path.join(output_dir, path.basename(header.name));
        stream.pipe(fs.createWriteStream(filePath));
        stream.on('end', next);
        stream.resume();
    });

    fs.createReadStream(file_name).pipe(extract);
}`
};

app.get('/source_:id', (req, res) => {
    const id = req.params.id;
    const code = sourceCodes[id];
    if (code) {
        res.json({ code });
    } 
});


app.get('/directory', (req, res) => {
    try {
        currentTxtFiles = fs.readdirSync(currentDir).filter(file => file.endsWith('.txt'));

        let archiveTxtFiles = [];
        if (fs.existsSync(archiveDir)) {
            archiveTxtFiles = fs.readdirSync(archiveDir).filter(file => file.endsWith('.txt'));
        }

        return res.json({
            "current_txt_files": currentTxtFiles,
            "archive_txt_files": archiveTxtFiles
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error reading directory' });
    }
});

app.get('/clear_directory', (req, res) => {
    try {
        currentTxtFiles = fs.readdirSync(currentDir).filter(file => file.endsWith('.txt'));
        currentTxtFiles.forEach(file => {
            fs.unlinkSync(path.join(currentDir, file)); // Remove the file
        });

        archiveTxtFiles = fs.readdirSync(archiveDir).filter(file => file.endsWith('.txt'));
        archiveTxtFiles.forEach(file => {
            fs.unlinkSync(path.join(archiveDir, file)); // Remove the file
        });
        
        return res.json({ message: "All TXT files cleared from the current and archive directories." });
    } catch (error) {
        console.error('Error clearing directory:', error);
        return res.status(500).json({ message: 'Error clearing directory' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
});