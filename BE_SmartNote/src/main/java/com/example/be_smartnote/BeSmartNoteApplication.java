package com.example.be_smartnote;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BeSmartNoteApplication {

    public static void main(String[] args) {
        SpringApplication.run(BeSmartNoteApplication.class, args);
    }

}
