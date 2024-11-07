package com.example;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.codehaus.plexus.archiver.tar.TarUnArchiver;


public class UntarTesting {
    public static void main(String[] args) {

        String tarFilePath = "Java/poc/payloads/payload.tar";
        String destDir = "Java/poc/archives"; 

        unsafe_untar2(tarFilePath, destDir);
    }

    public static void unsafe_untar(String file_name,String output){
        File destDir = new File(output);
        if(!destDir.exists()){destDir.mkdirs();}

        try(TarArchiveInputStream tarIn = new TarArchiveInputStream((new FileInputStream(file_name)))){
            ArchiveEntry entry;
            while((entry = tarIn.getNextEntry()) != null){
                String path = output + File.separator + entry.getName();
                // create parents
                new File(path).getParentFile().mkdirs();

                try(FileOutputStream fos = new FileOutputStream(path)){
                    byte[] buffer = new byte[1024];
                    int length;
                    while ((length = tarIn.read(buffer)) != -1) {
                        fos.write(buffer, 0, length);
                    }
                }
            }
        } catch (IOException e){
            e.printStackTrace();
        }
    }

    public static void unsafe_untar2(String file_name,String output){
        File destDir = new File(output);
        if(!destDir.exists()){destDir.mkdirs();}

        try(TarArchiveInputStream tarIn = new TarArchiveInputStream((new FileInputStream(file_name)))){
            ArchiveEntry entry;
            while((entry = tarIn.getNextEntry()) != null){
                String path = output + File.separator + entry.getName();

                // create parents
                new File(path).getParentFile().mkdirs();

                try (BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(path))){
                    byte[] buffer = new byte[1024];
                    int length;
                    while ((length = tarIn.read(buffer)) >= 0) {
                        bos.write(buffer, 0, length);
                    }
                }
            }
        } catch (IOException e){
            e.printStackTrace();
        }
    }


    public static void unsafe_untar3(String file_name, String output) {
        File destDir = new File(output);
        if(!destDir.exists()){destDir.mkdirs();}

        try (TarArchiveInputStream tarIn = new TarArchiveInputStream(new BufferedInputStream(new FileInputStream(file_name)))){
            ArchiveEntry entry;
            while((entry = tarIn.getNextEntry()) != null){
                Path extractTo = Paths.get(output).resolve(entry.getName());

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

    public static void unsafe_untar4(String file_name, String output) {
        File destDir = new File(output);
        if(!destDir.exists()){destDir.mkdirs();}

        try (TarArchiveInputStream tarIn = new TarArchiveInputStream(new BufferedInputStream(new FileInputStream(file_name)))){
            ArchiveEntry entry;
            while((entry = tarIn.getNextEntry()) != null){
                Path extractTo = Paths.get(output,entry.getName());
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

    public static void safe_tar2(String file_name, String output){
        File input = new File(file_name);
        File destDir = new File(output);

        TarUnArchiver unArchiver = new TarUnArchiver();
        unArchiver.setSourceFile(input);
        unArchiver.setDestDirectory(destDir);
        unArchiver.extract();
    }

    public static void safe_tar(String file_name,String output){
        File destDir = new File(output);
        if(!destDir.exists()){destDir.mkdirs();}

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
}
