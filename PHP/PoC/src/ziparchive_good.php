<?php

function safe_unzip($zipFile) {
    # good
    $outputDir = getcwd();
    $zip = new ZipArchive();
    if ($zip->open($zipFile) === TRUE) {
        $zip->extractTo($outputDir);
        $zip->close();
        echo "Extraction complete to: " . $outputDir;
    } else {
        echo "Failed to open the ZIP file.";
    }
}

function safe_unzip2($file_name, $output) {
    # good
    $zip = new ZipArchive;

    if ($zip->open($file_name) === true) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);

            $safeEntry = basename($entry);
            $outputPath = $output . '/' . $safeEntry;
            copy("zip://$file_name#$entry", $outputPath);
        }

        $zip->close();
    } 
}

function safe_unzip3($file_name, $output) {
    # good
    # fp
    $zip = new ZipArchive;

    $realOutputDir = realpath($output);

    if ($zip->open($file_name) === true) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);
            $outputPath = $realOutputDir . '/' . $entry;
            $normalizedPath = realpath($outputPath);
            if (strpos($normalizedPath, $realOutputDir) === 0) {
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
    # good
    if (!is_dir($output_dir)) {
        mkdir($output_dir, 0777, true);
    }

    try {
        $phar = new PharData($file_name);
        $phar->extractTo($output_dir); 

        echo "TAR file extracted to: $output_dir\n";
    } catch (Exception $e) {
        echo "Failed to extract TAR file: ", $e->getMessage(), "\n";
    }
}

$zipFile = '../payloads/payload.tar'; 
safe_untar($zipFile, getcwd());

