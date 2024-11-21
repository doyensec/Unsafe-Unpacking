<?php

function unsafe_unzip($file_name, $output) {
    # bad
    $zip = new ZipArchive;
    $zip->open($file_name);
    for ($i = 0; $i < $zip->numFiles; $i++) {
        $entry = $zip->getNameIndex($i);
        $outputPath = $output . '/' . $entry;
        # ruleid: ziparchive_unsafe_unpacking
        copy("zip://" . $file_name . "#" . $entry, $outputPath);
    }
    $zip->close();
    
}

function unsafe_unzip_1($file_name, $output) {
    # bad
    $zip = new ZipArchive;
    $zip->open($file_name);
    for ($i = 0; $i < $zip->numFiles; $i++) {
        # ruleid: ziparchive_unsafe_unpacking
        copy("zip://" . $file_name . "#" . $zip->getNameIndex($i), $output . '/' . $zip->getNameIndex($i));
    }
    $zip->close();
    
}

function unsafe_unzip2($file_name, $output) {
    # bad
    $zip = new ZipArchive;
    if ($zip->open($path) === true) {
        for($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);
            # ruleid: ziparchive_unsafe_unpacking
            copy("zip://".$file_name."#".$entry, $output."/".$entry);
        }                   
        $zip->close();                   
    }
}

function safe_zip($file_name, $output) {
    # good
    $zip = new ZipArchive;
    if ($zip->open($path) === true) {
        for($i = 0; $i < $zip->numFiles; $i++) {
            # basename
            $entry = basename($zip->getNameIndex($i));
            copy("zip://".$file_name."#".$filename, $output."/".$entry);
        }                   
        $zip->close();                   
    }
}

function unsafe_unzip3($file_name, $output) {
    # bad
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        $i = 0;
        while ($i < $zip->numFiles) {
            $entry = $zip->getNameIndex($i);
            $outputPath = $output . '/' . $entry;
            # ruleid: ziparchive_unsafe_unpacking
            copy("zip://" . $file_name . "#" . $entry, $outputPath);
            $i++;
        }
        $zip->close();
    }
}

function unsafe_unzip4($file_name, $output) {
    # bad
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);
            $sourceStream = fopen("zip://".$file_name."#".$entry, 'r');
            $destStream = fopen($output."/".$entry, 'w');

            # ruleid: ziparchive_unsafe_unpacking
            stream_copy_to_stream($sourceStream, $destStream);

            fclose($sourceStream);
            fclose($destStream);
        }                   
        $zip->close();                   
    }
}

function unsafe_unzip5($file_name, $output) {
    # bad
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);
            $sourceStream = fopen("zip://".$file_name."#".$entry, 'r');
            $destStream = fopen($output."/".$entry, 'w');

            if ($sourceStream && $destStream) {
                while ($buffer = fread($sourceStream, 4096)) { 
                    # ruleid: ziparchive_unsafe_unpacking
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
    # bad
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);
            $sourceStream = fopen("zip://".$file_name."#".$entry, 'r');
            $destStream = fopen($output."/".$entry, 'w');

            while (!feof($sourceStream)) {
                # ruleid: ziparchive_unsafe_unpacking
                fwrite($destStream, fread($sourceStream, 8192)); 
            }

            fclose($sourceStream);
            fclose($destStream);
        }                   
        $zip->close();                   
    }
}

function unsafe_unzip7($file_name, $output) {
    # bad
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $filename = $zip->getNameIndex($i);
            $sourceStream = fopen("zip://".$file_name."#".$filename, 'r');

            $outputFilePath = $output . "/" . $filename;

            # ruleid: ziparchive_unsafe_unpacking
            file_put_contents($outputFilePath, stream_get_contents($sourceStream));

            fclose($sourceStream);
        }                   
        $zip->close();                   
    }
}

function unsafe_unzip8($file_name, $output) {
    # bad
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        for($i = 0; $i < $zip->numFiles; $i++) {
            $filename = $zip->getNameIndex($i);
            # ruleid: ziparchive_unsafe_unpacking
            file_put_contents($filename, $output."/".$this->getFromIndex($i));
        }                   
        $zip->close();                   
    }
}

function unsafe_unzip9($file_name, $output) {
    # bad
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $filename = $zip->getNameIndex($i);
            $sourceStream = fopen("zip://".$file_name."#".$filename, 'r');
            $destStream = fopen($output . "/" . $filename, 'w');
            if ($sourceStream && $destStream) {
                # ruleid: ziparchive_unsafe_unpacking
                fpassthru($sourceStream);
                fclose($sourceStream);
                fclose($destStream);
            }
        }
        $zip->close();
    }
}

function unsafe_unzip10($zipFilePath, $outputDir) {
    # bad
    $zip = new ZipArchive;

    if ($zip->open($zipFilePath) === TRUE) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);
            $outputPath = $outputDir . '/' . $entry;

            # ruleid: ziparchive_unsafe_unpacking
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