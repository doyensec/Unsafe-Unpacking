import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;

public class UnzipTesting {
    public static void main(String[] args) {
        String zipFilePath = "../payloads/payload.zip"; 
        String destDir = "archive"; // Replace with your output directory

        unsafe_unzip(zipFilePath, destDir);
    }   

    public static void unsafe_unzip(String file_name, String output) {
        try (ZipInputStream zip = new ZipInputStream(new FileInputStream(file_name))) {
            ZipEntry entry;
            while ((entry = zip.getNextEntry()) != null) {
                try {
                String path = output + File.separator + entry.getName();


                // create parents
                new File(path).getParentFile().mkdirs();

                try (FileOutputStream fos = new FileOutputStream(path)) {
                    byte[] buffer = new byte[1024];
                    int len;
                    while ((len = zip.read(buffer)) > 0) {
                        fos.write(buffer, 0, len);
                    }
                }
                zip.closeEntry();
                } catch (Exception e) {} 
            }
        } catch (IOException e) {}
    } 
    
    public static void unsafe_unzip2(String file_name, String output) {
        try (ZipInputStream zip = new ZipInputStream(new FileInputStream(file_name))) {
            ZipEntry entry;
            while ((entry = zip.getNextEntry()) != null) {
                String path = output + File.separator + entry.getName();

                // create parents
                //new File(path).getParentFile().mkdirs();

                try (BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(path))) {
                    byte[] buffer = new byte[1024];
                    int length;
                    while ((length = zip.read(buffer)) >= 0) {
                        bos.write(buffer, 0, length);
                    }
                }
                zip.closeEntry();
            }
        } catch (IOException e) {}
    } 

    public static void unsafe_unzip3(String file_name, String output) {
        Path destDir = Paths.get(output);
        try (ZipInputStream zip = new ZipInputStream(Files.newInputStream(Paths.get(file_name)))) {
            ZipEntry entry;
            while ((entry = zip.getNextEntry()) != null) {
                Path path = destDir.resolve(entry.getName());

                // Create parent directories if needed
                Files.createDirectories(path.getParent());
                // Write file content
                Files.copy(zip, path, StandardCopyOption.REPLACE_EXISTING);

                zip.closeEntry();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void unsafe_unzip4(String zipFilePath, String destDirectory) {
        try (ZipFile zipFile = new ZipFile(new File(zipFilePath))) {
            zipFile.entries().asIterator().forEachRemaining(entry -> {
                try {
                    String entryName = entry.getName();
                    File file = new File(destDirectory, entryName);
                
                    
                    if (entry.isDirectory()) {
                        file.mkdirs(); // Create directories if it's a directory entry
                    } else {
                        file.getParentFile().mkdirs(); // Create parent directories
                        // Extract the file
                        try (var inputStream = zipFile.getInputStream(entry);
                             var outputStream = new java.io.FileOutputStream(file)) {
                            inputStream.transferTo(outputStream);
                        }
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void unsafe_unzip5(String zipFilePath, String destDirectory) {
    try (ZipFile zipFile = new ZipFile(new File(zipFilePath))) {
        Enumeration<? extends ZipEntry> entries = zipFile.entries();
        
        while (entries.hasMoreElements()) {
            ZipEntry entry = entries.nextElement();
            try {
                String entryName = entry.getName();
                File file = new File(destDirectory, entryName);

                if (entry.isDirectory()) {
                    file.mkdirs(); // Create directories if it's a directory entry
                } else {
                    file.getParentFile().mkdirs(); // Create parent directories
                    // Extract the file
                    try (InputStream inputStream = zipFile.getInputStream(entry);
                         FileOutputStream outputStream = new FileOutputStream(file)) {
                        inputStream.transferTo(outputStream);
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}

    public static void unsafe_unzip6(String file_name, String output) {
        //bad
        File destDir = new File(output);
        if (!destDir.exists()) {destDir.mkdirs();}
        //
        try (ZipInputStream zip = new ZipInputStream(Files.newInputStream(Paths.get(file_name))))
        {
            ZipEntry entry;
            while ((entry = zip.getNextEntry()) != null) {
                Path path = Paths.get(output).resolve(entry.getName());
                // Create parent directories if needed
                Files.createDirectories(path.getParent());
                // Write file content
                Files.copy(zip, path, StandardCopyOption.REPLACE_EXISTING);

                zip.closeEntry();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void unsafe_unzip7(String file_name, String output) {
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

    public static void safe_unzip(String zipFilePath, String destDirectory) {
        try (ZipFile zipFile = new ZipFile(new File(zipFilePath))) {
            zipFile.entries().asIterator().forEachRemaining(entry -> {
                try {
                    String entryName = entry.getName();
                    File file = new File(destDirectory, entryName);
                    
                    // Validate that the entry is within the destination directory
                    if (!file.getCanonicalPath().startsWith(new File(destDirectory).getCanonicalPath() + File.separator)) {
                        System.err.println("Invalid entry: " + entryName);
                        return; // Skip this entry
                    }
                    
                    if (entry.isDirectory()) {
                        file.mkdirs(); // Create directories if it's a directory entry
                    } else {
                        file.getParentFile().mkdirs(); // Create parent directories
                        // Extract the file
                        try (var inputStream = zipFile.getInputStream(entry);
                             var outputStream = new java.io.FileOutputStream(file)) {
                            inputStream.transferTo(outputStream);
                        }
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void unzipgpt(String zipFilePath, String destDirectory) throws IOException {
        try (ZipFile zipFile = new ZipFile(zipFilePath)) {
            Enumeration<? extends ZipEntry> entries = zipFile.entries();
            while (entries.hasMoreElements()) {
                ZipEntry entry = entries.nextElement();
                File file = new File(destDirectory, entry.getName());
                if (entry.isDirectory()) {
                    file.mkdirs();
                } else {
                    file.getParentFile().mkdirs();
                    try (InputStream inputStream = zipFile.getInputStream(entry);
                         FileOutputStream outputStream = new FileOutputStream(file)) {
                        inputStream.transferTo(outputStream);
                    }
                }
            }
        }
    }
}
