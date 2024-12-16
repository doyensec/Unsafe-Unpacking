package com.example;

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
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;

import org.codehaus.plexus.archiver.zip.ZipUnArchiver;
import org.zeroturnaround.zip.ZipUtil;

public class UnzipTesting {
    public static void main(String[] args) {

        String zipFilePath = "Java/poc/payloads/payload.zip";
        String destDir = "Java/poc/archives"; // Replace with your output directory
        unsafe_unzip(zipFilePath, destDir); // Replace with desired function to test
    }

    public static void unsafe_unzip(String file_name, String output) {
        // bad
        File destDir = new File(output);
        if (!destDir.exists()) {destDir.mkdirs();}

        try (ZipInputStream zip = new ZipInputStream(new FileInputStream(file_name))) {
            ZipEntry entry;
            while ((entry = zip.getNextEntry()) != null) {
                String path = output + File.separator + entry.getName();

                // ruleid: zipfile_unsafe_unpacking
                new File(path).getParentFile().mkdirs();

                // ruleid: zipfile_unsafe_unpacking
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

    public static void unsafe_unzip2(String file_name, String output) {
        // bad
        File destDir = new File(output);
        if (!destDir.exists()) {destDir.mkdirs();}

        try (ZipInputStream zip = new ZipInputStream(new FileInputStream(file_name))) {
            ZipEntry entry;
            while ((entry = zip.getNextEntry()) != null) {
                String path = output + File.separator + entry.getName();

                // ruleid: zipfile_unsafe_unpacking
                new File(path).getParentFile().mkdirs();
                
                // ruleid: zipfile_unsafe_unpacking
                try (BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(path))){
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
        //bad
        File destDir = new File(output);
        if (!destDir.exists()) {destDir.mkdirs();}
        //
        try (ZipInputStream zip = new ZipInputStream(Files.newInputStream(Paths.get(file_name))))
        // Don't change anything about the dest dir, either Files.newInputStream(Paths.get(file_name)) or new FileInputStream(file_name)
        {
            ZipEntry entry;
            while ((entry = zip.getNextEntry()) != null) {
                String path = Paths.get(output,entry.getName()).toString();

                // ruleid: zipfile_unsafe_unpacking
                new File(path).getParentFile().mkdirs();
                
                // ruleid: zipfile_unsafe_unpacking
                try (BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(path))) {
                    byte[] buffer = new byte[1024];
                    int length;
                    while ((length = zip.read(buffer)) >= 0) {
                        bos.write(buffer, 0, length);
                    }
                }
                zip.closeEntry();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void unsafe_unzip4(String file_name, String output) {
        //bad
        File destDir = new File(output);
        if (!destDir.exists()) {destDir.mkdirs();}
        
        try (ZipInputStream zip = new ZipInputStream(Files.newInputStream(Paths.get(file_name))))
        {
            // Don't change anything about the dest dir, either Files.newInputStream(Paths.get(file_name)) or new FileInputStream(file_name)
            ZipEntry entry;
            while ((entry = zip.getNextEntry()) != null) {
                Path path = Paths.get(output).resolve(entry.getName());
                Files.createDirectories(path.getParent());
                // ruleid: zipfile_unsafe_unpacking
                Files.copy(zip, path, StandardCopyOption.REPLACE_EXISTING);

                zip.closeEntry();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

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
                        // ruleid: zipfile_unsafe_unpacking
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

    public static void safe_unzip1(String file_name, String output) {
        File destDir = new File(output);
        try (ZipFile zipFile = new ZipFile(new File(file_name))) {
            zipFile.entries().asIterator().forEachRemaining(entry -> {
                try{
                    Path destPath = Paths.get(output).resolve(entry.getName()).normalize();
                    if (!destPath.startsWith(destDir.toPath())) {
                        System.err.println("Skipping unsafe entry: " + entry.getName());
                        return; 
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

    public static void safe_unzip2(String file_name, String output){
        try{
            new net.lingala.zip4j.ZipFile(file_name).extractAll(output);
        }catch (IOException e){
            e.printStackTrace();
        }
    }

    public static void safe_unzip3(String file_name,String output){
        ZipUtil.unpack(new File(file_name),new File(output));
    } 

    public static void safe_unzip4(String file_name,String output){
        File input = new File(file_name);
        File destDir = new File(output);

        ZipUnArchiver unArchiver = new ZipUnArchiver();
        unArchiver.setDestDirectory(destDir);
        unArchiver.setSourceFile(input);

        unArchiver.extract();
    } 

    public static void safe_unzip5(String file_name, String output) {
        try (ZipFile zipFile = new ZipFile(new File(file_name))) {
            zipFile.entries().asIterator().forEachRemaining(entry -> {
                try{
                    Path destPath = Paths.get(output).resolve(Paths.get(entry.getName()).getFileName());
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
}