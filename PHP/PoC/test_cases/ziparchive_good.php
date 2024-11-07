<?php

function safe_unzip($zipFile) {
    // Output directory can be set to the current working directory
    $outputDir = getcwd();

    // Attempt to open the ZIP file
    $zip = new ZipArchive();
    if ($zip->open($zipFile) === TRUE) {
        // Extract files to the current working directory without validation
        $zip->extractTo($outputDir);
        $zip->close();
        echo "Extraction complete to: " . $outputDir;
    } else {
        echo "Failed to open the ZIP file.";
    }
}

function safe_unzip2($file_name, $output) {
    $zip = new ZipArchive;

    if ($zip->open($file_name) === true) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);

            $safeEntry = basename($entry);
            $outputPath = $output . '/' . $safeEntry;

            // Copy the file from the zip to the output directory
            copy("zip://$file_name#$entry", $outputPath);
        }

        $zip->close();
    } 
}

function safe_unzip3($file_name, $output) {
    $zip = new ZipArchive;

    // Ensure the output directory is an absolute path
    $realOutputDir = realpath($output);

    if ($zip->open($file_name) === true) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);
            // Construct the output path
            $outputPath = $realOutputDir . '/' . $entry;

            // Normalize the path and check if it starts with the output directory
            $normalizedPath = realpath($outputPath);
            if (strpos($normalizedPath, $realOutputDir) === 0) {
                // Safe to extract
                copy("zip://$file_name#$entry", $outputPath);
            } else {
                echo "Invalid entry name: $entry\n";
            }
        }
        $zip->close();
    } else {
        echo "Failed to open ZIP file.\n";
    }
}

function safe_untar($file_name, $output_dir) {
    // Ensure the output directory exists
    if (!is_dir($output_dir)) {
        mkdir($output_dir, 0777, true);
    }

    try {
        // Create a new PharData object
        $phar = new PharData($file_name);

        // Extract the tar file to the specified output directory
        $phar->extractTo($output_dir); // The output directory can be absolute or relative

        echo "TAR file extracted to: $output_dir\n";
    } catch (Exception $e) {
        echo "Failed to extract TAR file: ", $e->getMessage(), "\n";
    }
}

// Example usage
$zipFile = '../payloads/payload.tar'; // Input from user
safe_untar($zipFile, getcwd());

