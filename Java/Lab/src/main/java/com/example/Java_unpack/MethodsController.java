package com.example.Java_unpack;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

@RestController
public class MethodsController {

    Path currentDirectory = Paths.get("").toAbsolutePath();
    String payloads_dir = String.valueOf(Paths.get(currentDirectory.toString(),"payloads"));
    String archive_dir = String.valueOf(Paths.get(currentDirectory.toString(),"archive"));
    String uploads_dir = String.valueOf(Paths.get(currentDirectory.toString(),"uploads"));

    @GetMapping("/run_unsafe_tar")
    public MethodsResponse runUnsafeTar(){
        MethodsResponse response = new MethodsResponse();
        try{
            Methods.unsafe_untar(Paths.get(payloads_dir,"payload.tar").toString(),archive_dir);
            response.message = "unpacked";
        }
        catch(Exception e){
            response.message = "Delete the TXT files first";
        }
        return response;
    }

    @PostMapping("upload_1")
    public MethodsResponse runUnsafeUploadTar(@RequestParam("file") MultipartFile file) {
        MethodsResponse response = new MethodsResponse();

        try {
            Path tempPath = Paths.get(uploads_dir, file.getOriginalFilename());
            Files.copy(file.getInputStream(), tempPath, StandardCopyOption.REPLACE_EXISTING);

            Methods.unsafe_untar(tempPath.toString(), archive_dir);
            Files.delete(tempPath);

            response.message = "unpacked";
        } catch (IOException e) {
            System.out.println(e);
            response.message = "Delete the TXT files first";
        }

        return response;
    }

    @GetMapping("source_1")
    public MethodsResponse source_1(){
        String code = "public static void unsafe_untar(String file_name, String output) throws IOException {\n" +
                "        File destDir = new File(output);\n" +
                "        if(!destDir.exists()){destDir.mkdirs();}\n" +
                "\n" +
                "        TarArchiveInputStream tarIn = new TarArchiveInputStream(new BufferedInputStream(new FileInputStream(file_name)));\n" +
                "        ArchiveEntry entry;\n" +
                "        while((entry = tarIn.getNextEntry()) != null){\n" +
                "            Path extractTo = Paths.get(output,entry.getName());\n" +
                "            if (entry.isDirectory()) {\n" +
                "                Files.createDirectories(extractTo);\n" +
                "            } else {\n" +
                "                Files.copy(tarIn, extractTo);\n" +
                "            }\n" +
                "        }\n" +
                "}";
        MethodsResponse response = new MethodsResponse();
        response.code = code;
        return response;
    }
    @GetMapping("run_safe_tar")
    public MethodsResponse runSafeTar(){
        MethodsResponse response = new MethodsResponse();
        try{
            Methods.safe_untar(Paths.get(payloads_dir,"payload.tar").toString(),archive_dir);
            response.message = "unpacked";
        }
        catch(Exception e){
            response.message = "Delete the TXT files first";
        }
        return response;
    }

    @PostMapping("upload_2")
    public MethodsResponse runSafeUploadTar(@RequestParam("file") MultipartFile file) {
        MethodsResponse response = new MethodsResponse();

        try {
            Path tempPath = Paths.get(uploads_dir, file.getOriginalFilename());
            Files.copy(file.getInputStream(), tempPath, StandardCopyOption.REPLACE_EXISTING);

            Methods.safe_untar(tempPath.toString(), archive_dir);
            Files.delete(tempPath);

            response.message = "unpacked";
        } catch (IOException e) {
            System.out.println(e);
            response.message = "Delete the TXT files first";
        }

        return response;
    }

    @GetMapping("source_2")
    public MethodsResponse source_2(){
        String code = "    public static void safe_untar(String file_name,String output) throws IOException {\n" +
                "        File destDir = new File(output);\n" +
                "        if(!destDir.exists()){destDir.mkdirs();}\n" +
                "\n" +
                "        TarArchiveInputStream tarIn = new TarArchiveInputStream(new BufferedInputStream(new FileInputStream(file_name)));\n" +
                "        ArchiveEntry entry;\n" +
                "        while((entry = tarIn.getNextEntry()) != null){\n" +
                "            Path extractTo = Paths.get(output).resolve(Paths.get(entry.getName()).getFileName());\n" +
                "            if (entry.isDirectory()) {\n" +
                "                Files.createDirectories(extractTo);\n" +
                "            } else {\n" +
                "                Files.copy(tarIn, extractTo);\n" +
                "            }\n" +
                "        }\n" +
                "    }";
        MethodsResponse response = new MethodsResponse();
        response.code = code;
        return response;
    }

    @GetMapping("run_unsafe_zip")
    public MethodsResponse runUnsafeZip(){
        MethodsResponse response = new MethodsResponse();
        try{
            Methods.unsafe_unzip(Paths.get(payloads_dir,"payload.zip").toString(),archive_dir);
            response.message = "unpacked";
        }
        catch(Exception e){
            response.message = "Delete the TXT files first";
        }
        return response;
    }

    @PostMapping("upload_3")
    public MethodsResponse runUnsafeUploadZip(@RequestParam("file") MultipartFile file) {
        MethodsResponse response = new MethodsResponse();

        try {
            Path tempPath = Paths.get(uploads_dir, file.getOriginalFilename());
            Files.copy(file.getInputStream(), tempPath, StandardCopyOption.REPLACE_EXISTING);

            Methods.unsafe_unzip(tempPath.toString(), archive_dir);
            Files.delete(tempPath);

            response.message = "unpacked";
        } catch (IOException e) {
            System.out.println(e);
            response.message = "Delete the TXT files first";
        }

        return response;
    }

    @GetMapping("source_3")
    public MethodsResponse source3(){
        String code = "    public static void unsafe_unzip(String file_name, String output) throws IOException {\n" +
                "        ZipFile zipFile = new ZipFile(new File(file_name));\n" +
                "        zipFile.entries().asIterator().forEachRemaining(entry -> {\n" +
                "            try{\n" +
                "                Path destPath = Paths.get(output, entry.getName());\n" +
                "                File fil = new File(destPath.toString());\n" +
                "\n" +
                "                if (entry.isDirectory()) {\n" +
                "                    fil.mkdirs();\n" +
                "                } else {\n" +
                "                    fil.getParentFile().mkdirs();\n" +
                "                    try (InputStream in = zipFile.getInputStream(entry);\n" +
                "                         OutputStream out = Files.newOutputStream(destPath)) {\n" +
                "                        in.transferTo(out);\n" +
                "                    }\n" +
                "                }\n" +
                "            }catch (IOException e){\n" +
                "                e.printStackTrace();\n" +
                "            }\n" +
                "        });\n" +
                "    }";
        MethodsResponse response = new MethodsResponse();
        response.code = code;
        return response;
    }

    @GetMapping("run_safe_zip")
    public MethodsResponse runSafeZip(){
        MethodsResponse response = new MethodsResponse();
        try{
            Methods.safe_unzip(Paths.get(payloads_dir,"payload.zip").toString(),archive_dir);
            response.message = "unpacked";
        }
        catch(Exception e){
            response.message = "Delete the TXT files first";
        }
        return response;
    }

    @PostMapping("upload_4")
    public MethodsResponse runSafeUploadZip(@RequestParam("file") MultipartFile file) {
        MethodsResponse response = new MethodsResponse();

        try {
            Path tempPath = Paths.get(uploads_dir, file.getOriginalFilename());
            Files.copy(file.getInputStream(), tempPath, StandardCopyOption.REPLACE_EXISTING);

            Methods.safe_unzip(tempPath.toString(), archive_dir);
            Files.delete(tempPath);

            response.message = "unpacked";
        } catch (IOException e) {
            System.out.println(e);
            response.message = "Delete the TXT files first";
        }

        return response;
    }

    @GetMapping("source_4")
    public MethodsResponse source4(){
        String code = "    public static void safe_unzip(String file_name, String output) throws IOException {\n" +
                "        ZipFile zipFile = new ZipFile(new File(file_name));\n" +
                "        zipFile.entries().asIterator().forEachRemaining(entry -> {\n" +
                "            try{\n" +
                "                Path destPath = Paths.get(output,Paths.get(entry.getName()).getFileName().toString());\n" +
                "                File fil = new File(destPath.toString());\n" +
                "\n" +
                "                if (entry.isDirectory()) {\n" +
                "                    fil.mkdirs();\n" +
                "                } else {\n" +
                "                    fil.getParentFile().mkdirs();\n" +
                "                    try (InputStream in = zipFile.getInputStream(entry);\n" +
                "                         OutputStream out = Files.newOutputStream(destPath)) {\n" +
                "                        in.transferTo(out);\n" +
                "                    }\n" +
                "                }\n" +
                "            }catch (IOException e){\n" +
                "                e.printStackTrace();\n" +
                "            }\n" +
                "        });\n" +
                "    }";
        MethodsResponse response = new MethodsResponse();
        response.code = code;
        return response;
    }

    @GetMapping("/directory")
    public MethodsResponse directory(){
        File directory = new File(currentDirectory.toString());
        MethodsResponse response = new MethodsResponse();
        List<String> currentTxt = new ArrayList<>();
        File[] files = directory.listFiles();
        if (files != null){
            for(File file : files){
                if(file.getName().endsWith("txt")){
                    currentTxt.add(file.getName());
                }
            }
        }
        response.current_txt_files = currentTxt;

        File archive = new File(archive_dir);
        File[] afiles = archive.listFiles();
        List<String> archiveTxt = new ArrayList<>();
        if (afiles != null){

            for(File file : afiles){
                if(file.getName().endsWith("txt")){
                    archiveTxt.add(file.getName());
                }
            }
        }
        response.archive_txt_files = archiveTxt;

        return response;
    }
    @GetMapping("/clear_directory")
    public MethodsResponse clearDirectory(){
        File directory = new File(currentDirectory.toString());
        File[] files = directory.listFiles();
        if (files != null){
            for(File file : files){
                if(file.getName().endsWith("txt")){
                    file.delete();
                }
            }
        }

        File archive = new File(archive_dir);
        File[] afiles = archive.listFiles();
        if (afiles != null){
            for(File file : afiles){
                if(file.getName().endsWith("txt")){
                    file.delete();
                }
            }
        }
        MethodsResponse response = new MethodsResponse();
        response.message = "All TXT files cleared from the current and archive directories.";
        return response;
    }

}
