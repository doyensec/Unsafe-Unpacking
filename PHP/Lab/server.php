<?php
// server.php


$currentDir = getcwd();
$archiveDir = $currentDir . '/archive';
$payloadDir = $currentDir . '/payloads';
// Define the source code as a string
$sourceCodes = [
    1 => <<<'EOD'
function unsafe_unzip($zipFilePath, $outputDir) {
    $zip = new ZipArchive;

    // Open the zip file
    if ($zip->open($zipFilePath) === TRUE) {
        // Iterate through the files in the zip
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);
            $outputPath = $outputDir . '/' . $entry;

            // Copy the file from the zip to the output directory
            copy("zip://$zipFilePath#$entry", $outputPath);
        }
        $zip->close();
    } else {
        echo 'Failed to open zip file';
    }
}
EOD, 
    2 => <<<'EOD'
function safe_unzip($file_name, $output) {
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        for($i = 0; $i < $zip->numFiles; $i++) {
            $entry = basename($zip->getNameIndex($i));
            copy("zip://".$file_name."#".$zip->getNameIndex($i), $output."/".$entry);
        }                   
        $zip->close();                   
    }
}
EOD,
    3 => <<<'EOD'
function safe_unzip2($zipFile, $outputDir) {

    $zip = new ZipArchive();
    if ($zip->open($zipFile) === TRUE) {
        $zip->extractTo($outputDir);
        $zip->close();
        echo "Extraction complete to: " . $outputDir;
    } else {
        echo "Failed to open the ZIP file.";
    }
}
EOD
];

function unsafe_unzip($zipFilePath, $outputDir) {
    $zip = new ZipArchive;

    // Open the zip file
    if ($zip->open($zipFilePath) === TRUE) {
        // Iterate through the files in the zip
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);
            $outputPath = $outputDir . '/' . $entry;

            // Copy the file from the zip to the output directory
            copy("zip://$zipFilePath#$entry", $outputPath);
        }
        $zip->close();
    } else {
        echo 'Failed to open zip file';
    }
}

function safe_unzip($file_name, $output) {
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        for($i = 0; $i < $zip->numFiles; $i++) {
            $entry = basename($zip->getNameIndex($i));
            copy("zip://".$file_name."#".$zip->getNameIndex($i), $output."/".$entry);
        }                   
        $zip->close();                   
    }
}

function safe_unzip2($zipFile, $outputDir) {

    $zip = new ZipArchive();
    if ($zip->open($zipFile) === TRUE) {
        $zip->extractTo($outputDir);
        $zip->close();
    }
}

// Check if the source is requested
if (isset($_GET['source'])) {
    $sourceIndex = intval($_GET['source']);
    header('Content-Type: application/json'); // Set the header to plain text
    echo json_encode(['code' => $sourceCodes[$sourceIndex]]);
} elseif (isset($_GET['run'])) { 
    $func = $_GET['run'];
    if ($func == "unsafe_ziparchive") {
        unsafe_unzip($payloadDir . "/payload.zip", $archiveDir);
        header('Content-Type: application/json');
        echo json_encode(['message' => 'unpacked']);
    } 
    if ($func == "safe_ziparchive_1") {
        safe_unzip($payloadDir . "/payload.zip", $archiveDir);
        header('Content-Type: application/json');
        echo json_encode(['message' => 'unpacked']);
    } 
    if ($func == "safe_ziparchive_2") {
        ≈($payloadDir . "/payload.zip", $archiveDir);
        header('Content-Type: application/json');
        echo json_encode(['message' => 'unpacked']);
    } 
} elseif (isset($_GET['upload'])) {
    $upload = $_GET['upload'];
    $uploadedFile = $_FILES['file'];
    
    $tmpFilePath = 'uploads/' . $uploadedFile['name'];
    if (move_uploaded_file($uploadedFile['tmp_name'], $tmpFilePath)) {
        try {
            if ($upload == 1) {
                unsafe_unzip($tmpFilePath, $archiveDir);
            }
            if ($upload == 2) {
                safe_unzip($tmpFilePath, $archiveDir);
            }
            if ($upload == 3) {
                safe_unzip2($tmpFilePath, $archiveDir);
            }

            echo json_encode(['message' => 'unpacked']);

            unlink($tmpFilePath);
        } catch (Exception $e) {
        }
    } else {
        echo "Failed to upload the file.<br>";
    }
} elseif (isset($_GET['directory'])) {
    $currentTxtFiles = array_diff(scandir($currentDir), ['..', '.']);
    $currentTxtFiles = array_values(array_filter($currentTxtFiles, function($file) {
        return pathinfo($file, PATHINFO_EXTENSION) === 'txt';
    }));

    $archiveTxtFiles = [];
    if (is_dir($archiveDir)) {
        $archiveTxtFiles = array_diff(scandir($archiveDir), ['..', '.']);
        $archiveTxtFiles = array_values(array_filter($archiveTxtFiles, function($file) {
            return pathinfo($file, PATHINFO_EXTENSION) === 'txt';
        }));
    }
    echo json_encode([
        "current_txt_files" => $currentTxtFiles,
        "archive_txt_files" => $archiveTxtFiles
    ]);
} elseif (isset($_GET['clear'])) {
    $currentTxtFiles = array_diff(scandir($currentDir), ['..', '.']);
    foreach ($currentTxtFiles as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'txt') {
            unlink($currentDir . '/' . $file); 
        }
    }

    if (is_dir($archiveDir)) {
        $archiveTxtFiles = array_diff(scandir($archiveDir), ['..', '.']);
        foreach ($archiveTxtFiles as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'txt') {
                unlink($archiveDir . '/' . $file); 
            }
        }
    }
    echo json_encode([
        "message" => "All TXT files cleared from the current and archive directories."
    ]);
} else {
    // Serve the index.html file
    $filePath = 'templates/index.html';
    
    if (file_exists($filePath)) {
        header('Content-Type: text/html'); // Set the header to HTML
        readfile($filePath); // Output the contents of index.html
    } else {
        echo 'Index file not found.';
    }
}
?>
