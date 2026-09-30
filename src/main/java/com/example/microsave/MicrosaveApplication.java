package com.example.microsave;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MicrosaveApplication {

    public static void main(String[] args) {

        SpringApplication.run(
                MicrosaveApplication.class,
                args
        );

        System.out.println("=================================");
        System.out.println("   MICROSAVE STARTED SUCCESSFULLY");
        System.out.println("   http://localhost:8080");
        System.out.println("=================================");
    }
}