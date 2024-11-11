package com.example.Java_unpack;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index(){
        return "index";
    }
}
