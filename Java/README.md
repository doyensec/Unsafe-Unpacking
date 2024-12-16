# Java Decompression Attack

## Introduction

There are various libraries that can be used for decompression in Java, some of them are `ZipFile`, `ZipInputStream` and `apache TarArchiveInputStream`.

## Unsafe Usages

`java.util.zip.ZipInputStream`, `java.util.zip.ZipFile` and `apache TarArchiveInputStream` allow the programmer to implement the extraction themselves using `FileOutputStream` or `Files.copy`.

The programmer can iterate through the entries and use the previously mentioned methods to extract the content of the entries. This makes the programmer responsible for sanitizing and validating all the filenames of the entries, preventing path injection.

The following code snippets demonstrate the **VULNERABLE** usage of each library:

### ZipInputStream

The following function is unsafe since the `entry.getName()` is not sanitized or validated allowing the attacker to create a `FileOutputStream` pointing out of the output directory:

```java
public static void unsafe_unzip(String file_name, String output) {
    File destDir = new File(output);
    try (ZipInputStream zip = new ZipInputStream(new FileInputStream(file_name))) {
        ZipEntry entry;
        while ((entry = zip.getNextEntry()) != null) {
            String path = output + File.separator + entry.getName();
            try (FileOutputStream fos = new FileOutputStream(path)) {
                byte[] buffer = new byte[1024];
                int len;
                while ((len = zip.read(buffer)) > 0) {
                    fos.write(buffer, 0, len);
                }
            }
            zip.closeEntry();
        }
    } catch (IOException e) {}
}
```

### ZipFile

The following function is unsafe since the `entry.getName()` is not sanitized or validated allowing the attacker to create a `FileOutputStream` pointing out of the output directory:

```java
public static void unsafe_unzip5(String file_name, String output) {
    try (ZipFile zipFile = new ZipFile(new File(file_name))) {
        zipFile.entries().asIterator().forEachRemaining(entry -> {
            try{
                Path destPath = Paths.get(output, entry.getName());
                File fil = new File(destPath.toString());

                if (entry.isDirectory()) {
                    fil.mkdirs();
                } else {
                    fil.getParentFile().mkdirs();
                    try (InputStream in = zipFile.getInputStream(entry);
                            OutputStream out = Files.newOutputStream(destPath)) {
                        in.transferTo(out);
                    }
                }
            }catch (IOException e){

            }
        });
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```


### TarArchiveInputStream

`TarArchiveInputStream` is a class from Apache Commons used to read each entry as a normal input stream. Since this is used as reader, the programmer is the responsible to implement the extraction. 

```java
public static void unsafe_untar(String file_name, String output) {
    File destDir = new File(output);

    try (TarArchiveInputStream tarIn = new TarArchiveInputStream(new BufferedInputStream(new FileInputStream(file_name)))){
        ArchiveEntry entry;
        while((entry = tarIn.getNextEntry()) != null){
            Path extractTo = Paths.get(output).resolve(entry.getName());
            Files.copy(tarIn, extractTo);
        }
    } catch (IOException e){
        e.printStackTrace();
    }
}
```

In the method above the `entry.getName()` is not sanitized or validated, allowing attacker to point to out of the output directory leading to path traversal.

## Safe Usages

### [ZipUnArchiver](https://github.com/sonatype/plexus-archiver/blob/master/src/main/java/org/codehaus/plexus/archiver/zip/ZipUnArchiver.java)

`org.codehaus.plexus.archiver.zip.ZipUnArchiver` class from Plaus Archiver provides a safe implementation to extract files from a ZIP. The following method ensures that files are extracted into the output directory without risking path traversal attacks:

```java
public static void safe_unzip(String file_name,String output){
    File input = new File(file_name);
    File destDir = new File(output);

    ZipUnArchiver unArchiver = new ZipUnArchiver();
    unArchiver.setDestDirectory(destDir);
    unArchiver.setSourceFile(input);

    unArchiver.extract();
} 
```

### [ZipUtil](https://javadoc.io/doc/org.zeroturnaround/zt-zip/1.6/org/zeroturnaround/zip/ZipUtil.html)

`org.zeroturnaround.zip.ZipUtil` class from zeroturnaround provides a simple and safe implementation to extract files from a ZIP. The following method automatically handles the extraction process and prevents any files from being written outside the output directory, even if the archive contains potentially dangerous file paths:

```java
public static void safe_unzip(String file_name,String output){
    ZipUtil.unpack(new File(file_name),new File(output));
} 
```

### ZipInputStream / ZipFile

Both `ZipInputStream` and `ZipFile` classes are readers, allowing developers to access and iterate through the entries within the ZIP. Since the class lacks an extraction method, developers are responsible of ensuring that the write path is sanitized and within the output path.

#### Path Sanitization

To sanitize the path, we can normalize it using `getFileName()`. This method extracts only the filename from a given path, removing directory components:

```java
public static void safe_unzip(String file_name, String output) {
    try (ZipFile zipFile = new ZipFile(new File(file_name))) {
        zipFile.entries().asIterator().forEachRemaining(entry -> {
            try{
                Path destPath = Paths.get(output).resolve(Paths.get(entry.getName()).getFileName());
                File fil = new File(destPath.toString());

                try (InputStream in = zipFile.getInputStream(entry);
                        OutputStream out = Files.newOutputStream(destPath)) {
                    in.transferTo(out);
                }
            }catch (IOException e){
            }
        });
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

#### Path Validation

Alternativeky, before writing the content of the entry to the write path, ensure that the write path is within the destination path using `startsWith()`:

```java
public static void unsafe_unzip6(String file_name, String output) {
    File destDir = new File(output);
    try (ZipFile zipFile = new ZipFile(new File(file_name))) {
        zipFile.entries().asIterator().forEachRemaining(entry -> {
            try{
                Path destPath = Paths.get(output).resolve(entry.getName()).normalize();
                if (!destPath.startsWith(destDir.toPath())) {
                    System.err.println("Skipping unsafe entry: " + entry.getName());
                    return; // Skip this entry to prevent path traversal
                }

                try (InputStream in = zipFile.getInputStream(entry);
                        OutputStream out = Files.newOutputStream(destPath)) {
                    in.transferTo(out);
                }
                
            }catch (IOException e){

            }
        });
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

#### Importance of `.normalize()`

Using `.normalize()` is crucial, this method converts a relative file path into an absolute file path, ensuring proper validations:

```java
Path destPath = Paths.get(output).resolve(entry.getName()).normalize();
if (!destPath.startsWith(destDir.toPath())) {
    System.err.println("Skipping unsafe entry: " + entry.getName());
    return; 
}
```

### TarArchiveInputStream

`TarArchiveInputStream` is a class from Apache Commons used to read each entry as a normal input stream. Since this is used as reader, the programmer is the responsible to implement the extraction. 

#### Path Sanitization

To sanitize the path, we can normalize it using `getFileName()`. This method extracts only the filename from a given path, removing directory components:

```java
public static void safe_tar(String file_name,String output){
    File destDir = new File(output);

    try (TarArchiveInputStream tarIn = new TarArchiveInputStream(new BufferedInputStream(new FileInputStream(file_name)))){
        ArchiveEntry entry;
        while((entry = tarIn.getNextEntry()) != null){
            Path extractTo = Paths.get(output).resolve(Paths.get(entry.getName()).getFileName());
            if (entry.isDirectory()) {
                Files.createDirectories(extractTo);
            } else {
                Files.copy(tarIn, extractTo);
            }
        }
    } catch (IOException e){
        e.printStackTrace();
    }
}
```