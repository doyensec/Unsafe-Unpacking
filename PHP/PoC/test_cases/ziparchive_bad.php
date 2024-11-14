<?php

function unsafe_unzip($file_name, $output) {
    $zip = new ZipArchive;
    $zip->open($file_name);
    for ($i = 0; $i < $zip->numFiles; $i++) {
        $entry = $zip->getNameIndex($i);
        $outputPath = $output . '/' . $entry;
        copy("zip://" . $file_name . "#" . $entry, $outputPath);
    }
    $zip->close();
    
}

function unsafe_unzip_2($file_name, $output) {
    $zip = new ZipArchive;
    $zip->open($file_name);
    for ($i = 0; $i < $zip->numFiles; $i++) {
        

        // Copy the file from the zip to the output directory
        copy("zip://" . $file_name . "#" . $zip->getNameIndex($i), $output . '/' . $zip->getNameIndex($i));
    }
    $zip->close();
    
}

function unsafe_unzip2($file_name, $output) {
    $zip = new ZipArchive;
    if ($zip->open($path) === true) {
        for($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);
            copy("zip://".$file_name."#".$entry, $output."/".$entry);
        }                   
        $zip->close();                   
    }
}

function unzip2_good($file_name, $output) {
    $zip = new ZipArchive;
    if ($zip->open($path) === true) {
        for($i = 0; $i < $zip->numFiles; $i++) {
            $entry = basename($zip->getNameIndex($i));
            copy("zip://".$file_name."#".$filename, $output."/".$entry);
        }                   
        $zip->close();                   
    }
}

function unsafe_unzip3($file_name, $output) {
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        $i = 0;
        while ($i < $zip->numFiles) {
            $entry = $zip->getNameIndex($i);
            $outputPath = $output . '/' . $entry;

            copy("zip://" . $file_name . "#" . $entry, $outputPath);
            $i++;
        }
        $zip->close();
    }
}

function unsafe_unzip4($file_name, $output) {
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);
            $sourceStream = fopen("zip://".$file_name."#".$entry, 'r');
            $destStream = fopen($output."/".$entry, 'w');

            stream_copy_to_stream($sourceStream, $destStream);

            fclose($sourceStream);
            fclose($destStream);
        }                   
        $zip->close();                   
    }
}

function unsafe_unzip5($file_name, $output) {
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);
            $sourceStream = fopen("zip://".$file_name."#".$entry, 'r');
            $destStream = fopen($output."/".$entry, 'w');

            if ($sourceStream && $destStream) {
                while ($buffer = fread($sourceStream, 4096)) { 
                    fwrite($destStream, $buffer); 
                }
            }
            fclose($sourceStream);
            fclose($destStream);
        }                   
        $zip->close();                   
    }
}

function unsafe_unzip6($file_name, $output) {
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);
            $sourceStream = fopen("zip://".$file_name."#".$entry, 'r');
            $destStream = fopen($output."/".$entry, 'w');

            while (!feof($sourceStream)) {
                fwrite($destStream, fread($sourceStream, 8192)); // Read and write in chunks
            }

            fclose($sourceStream);
            fclose($destStream);
        }                   
        $zip->close();                   
    }
}

function unsafe_unzip7($file_name, $output) {
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $filename = $zip->getNameIndex($i);
            $sourceStream = fopen("zip://".$file_name."#".$filename, 'r');

            $outputFilePath = $output . "/" . $filename;

            file_put_contents($outputFilePath, stream_get_contents($sourceStream));

            fclose($sourceStream);
        }                   
        $zip->close();                   
    }
}

function unsafe_unzip8($file_name, $output) {
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        for($i = 0; $i < $zip->numFiles; $i++) {
            $filename = $zip->getNameIndex($i);
            file_put_contents($filename, $output."/".$this->getFromIndex($i));
        }                   
        $zip->close();                   
    }
}

function unsafe_unzip9($file_name, $output) {
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $filename = $zip->getNameIndex($i);
            $sourceStream = fopen("zip://".$file_name."#".$filename, 'r');
            $destStream = fopen($output . "/" . $filename, 'w');
            if ($sourceStream && $destStream) {
                fpassthru($sourceStream);
                fclose($sourceStream);
                fclose($destStream);
            }
        }
        $zip->close();
    }
}

function unsafe_unzipa($zipFilePath, $outputDir) {
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


$zipFile = '../payloads/payload.zip'; 
$destination = '../test_cases/';
unsafe_unzip($zipFile, $destination);

