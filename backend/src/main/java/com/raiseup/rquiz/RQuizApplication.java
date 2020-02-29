package com.raiseup.rquiz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class RQuizApplication
{
	public static void main(String[] args) {
		SpringApplication.run(RQuizApplication.class, args);
	}
}
