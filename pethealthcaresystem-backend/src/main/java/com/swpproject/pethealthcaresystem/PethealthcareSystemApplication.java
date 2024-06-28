package com.swpproject.pethealthcaresystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import javax.swing.*;

@SpringBootApplication
@EnableScheduling
public class PethealthcareSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(PethealthcareSystemApplication.class, args);
	}


}
