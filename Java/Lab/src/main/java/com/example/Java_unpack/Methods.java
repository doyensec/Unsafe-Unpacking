package com.example.Java_unpack;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.zip.ZipFile;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;

public class Methods {
    public static void unsafe_untar(String file_name, String output) throws IOException {
        File destDir = new File(output);
        if(!destDir.exists()){destDir.mkdirs();}

        TarArchiveInputStream tarIn = new TarArchiveInputStream(new BufferedInputStream(new FileInputStream(file_name)));
        ArchiveEntry entry;
        while((entry = tarIn.getNextEntry()) != null){
            Path extractTo = Paths.get(output,entry.getName());
            if (entry.isDirectory()) {
                Files.createDirectories(extractTo);
            } else {
                Files.copy(tarIn, extractTo);
            }
        }
    }

    public static void safe_untar(String file_name,String output) throws IOException {
        File destDir = new File(output);
        if(!destDir.exists()){destDir.mkdirs();}

        TarArchiveInputStream tarIn = new TarArchiveInputStream(new BufferedInputStream(new FileInputStream(file_name)));
        ArchiveEntry entry;
        while((entry = tarIn.getNextEntry()) != null){
            Path extractTo = Paths.get(output).resolve(Paths.get(entry.getName()).getFileName());
            if (entry.isDirectory()) {
                Files.createDirectories(extractTo);
            } else {
                Files.copy(tarIn, extractTo);
            }
        }
    }

    public static void unsafe_unzip(String file_name, String output) throws IOException {
        ZipFile zipFile = new ZipFile(new File(file_name));
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
                e.printStackTrace();
            }
        });
    }

    public static void safe_unzip(String file_name, String output) throws IOException {
        ZipFile zipFile = new ZipFile(new File(file_name));
        zipFile.entries().asIterator().forEachRemaining(entry -> {
            try{
                Path destPath = Paths.get(output,Paths.get(entry.getName()).getFileName().toString());
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
                e.printStackTrace();
            }
        });
    }
}
