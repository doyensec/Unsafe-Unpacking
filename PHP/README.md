# PHP Decompression Attacks

## Introduction

The class used in PHP to manage Zip archives is `ZipArchive`, which is a builtin class.

## Unsafe Usages

`ZipArchive` allows the programmer to implement the extraction themselves using `copy()`, `stream_copy_to_stream()`, `fwrite()`, `file_put_contents()` or `fpassthru()`. 

The content of the entries can be extracted by the programmer iterating through them and using the previously described techniques. In order to prevent path injection, the programmer is the responsible of sanitizing and verifying each entry's filename.

### ZipArchive

The following code snippets demonstrate the **VULNERABLE** usage:

`copy()`

```php
function unsafe_unzip($file_name, $output) {
    // bad
    $zip = new ZipArchive;
    $zip->open($file_name);
    for ($i = 0; $i < $zip->numFiles; $i++) {
        $entry = $zip->getNameIndex($i);
        $outputPath = $output . '/' . $entry;
        copy("zip://" . $file_name . "#" . $entry, $outputPath);
    }
    $zip->close();
    
}
```


`stream_copy_to_stream()`

```php
function unsafe_unzip($file_name, $output) {
    // bad
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
```

`fwrite()`

```php
function unsafe_unzip($file_name, $output) {
    // bad
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
```

`file_put_contents()`

```php
function unsafe_unzip($file_name, $output) {
    // bad
    $zip = new ZipArchive;
    if ($zip->open($file_name) === true) {
        for($i = 0; $i < $zip->numFiles; $i++) {
            $filename = $zip->getNameIndex($i);
            file_put_contents($filename, $output."/".$this->getFromIndex($i));
        }                   
        $zip->close();                   
    }
}
```

`fpassthru`

```php
function unsafe_unzip($file_name, $output) {
    // bad
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
```

## Safe Usages

To prevent path injection, it's essential to sanitize and validate the entry filename or use the `extractTo()` method, which is safe.

The following code snippets demonstrate how to properly implement archive extraction:

#### Using `extractTo`

The default `extractTo` sanitizes the entry filename and prevents path injection:

```php
function safe_unzip($zipFile) {
    // good
    $outputDir = getcwd();
    $zip = new ZipArchive();
    if ($zip->open($zipFile) === TRUE) {
        $zip->extractTo($outputDir);
        $zip->close();
        echo "Extraction complete to: " . $outputDir;
    } 
}
```

#### Using `basename`

Use `basename()` to remove redundant dots and slashes from the entry filename:

```php
function safe_unzip($file_name, $output) {
    // good
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
```

#### Output Path is within Output Directory

The `realpath()` method simplifies the provided path by removing redundant segments. For example, it converts a path like `/1/2/3/../entry` to `/1/2/entry`, effectively resolving any `..` segments that point to the parent directory.

Using `strpos()` we can ensure that output path must be within output dir to be extracted.


```php
function safe_unzip3($file_name, $output) {
    // good
    $zip = new ZipArchive;
    $realOutputDir = realpath($output);

    if ($zip->open($file_name) === true) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $entry = $zip->getNameIndex($i);
            $outputPath = $realOutputDir . '/' . $entry;
            $normalizedPath = realpath($outputPath);
            if (strpos($normalizedPath, $realOutputDir) === 0) {
                // Safe to extract
                copy("zip://$file_name#$entry", $outputPath);
            } else {
                echo "Invalid entry name: $entry\n";
            }
        }
        $zip->close();
    } 
}
```
