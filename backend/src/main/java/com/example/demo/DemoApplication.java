package com.example.demo;

import com.example.demo.models.ApplicationUser;
import com.example.demo.repo.ApplicationUserRepository;
import com.example.demo.services.UserDetailsServiceImpl;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.stream.Stream;

@SpringBootApplication
public class DemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean CommandLineRunner init(ApplicationUserRepository userRepository) {
		BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
		return args -> {
			Stream.of("John", "Julie", "Jennifer", "Helen", "Rachel")
					.forEach(name -> {
						ApplicationUser user = new ApplicationUser();
						user.setUsername(name);
						user.setPassword(bCryptPasswordEncoder.encode("123"));
						userRepository.save(user);
					});
			userRepository.findAll().forEach(System.out::println);
		};
	}
}
