package com.raiseup.rquiz;

import com.raiseup.rquiz.models.ApplicationUser;
import com.raiseup.rquiz.models.Quiz;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import com.raiseup.rquiz.services.QuizService;
import com.raiseup.rquiz.services.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.stream.Stream;

@SpringBootApplication
public class DemoApplication
{
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
    CommandLineRunner init(ApplicationUserRepository userRepository,
						   UserService userService,
						   QuizService quizService) {
		return args -> {
			Stream.of("John", "Julie", "Jennifer", "Helen", "Rachel")
					.forEach(name -> {
						ApplicationUser user = new ApplicationUser();
						user.setUsername(name);
						user.setPassword("123");
						userService.create(user);
					});
			String tempId = userRepository.findAll().get(0).getId();
			Stream.of("quiz a", "quiz b")
					.forEach(title -> {
						Quiz q = new Quiz();
						q.setTitle(title);
						q.setPublic(true);
						q.setCreatorId(tempId);
						quizService.create(q);
					});
			userRepository.findAll().forEach(System.out::println);
			System.out.println("---------------------------");
			quizService.readAll().forEach(System.out::println);
		};
	}
}
