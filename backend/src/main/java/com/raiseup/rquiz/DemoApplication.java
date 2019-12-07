package com.raiseup.rquiz;

import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.models.db.Quiz;
import com.raiseup.rquiz.models.db.QuizAnswer;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import com.raiseup.rquiz.services.QuizService;
import com.raiseup.rquiz.services.UserService;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import java.util.stream.Stream;

@SpringBootApplication
@EnableJpaAuditing
public class DemoApplication
{
	@Value("${rquiz.shouldSeedDatabase}")
	private boolean shouldSeedDatabase;

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
    CommandLineRunner init(ApplicationUserRepository userRepository,
						   UserService userService,
						   QuizService quizService) {
		if(!shouldSeedDatabase) {
			return null;
		}

		return args -> {
			Stream.of("John", "Julie", "Jennifer", "Helen", "Rachel")
					.forEach(name -> {
						User user = new User();
						user.setUsername(name);
						user.setEmail(String.format("%s@mail.com", name));
						user.setPassword("123");
						try{
							userService.create(user);
						}catch (Exception ex){
							System.err.println(ExceptionUtils.getFullStackTrace(ex));
						}
					});
			String tempId = userRepository.findAll().get(0).getId();
			Stream.of("quiz a", "quiz b", "quiz c", "quiz d", "quiz e", "quiz f", "quiz g", "quiz k", "quiz l", "quiz m", "quiz n", "quiz o",
					"quiz a", "quiz b", "quiz c", "quiz d", "quiz e", "quiz f", "quiz g", "quiz k", "quiz l", "quiz m", "quiz n", "quiz o", "quiz v")
					.forEach(title -> {
						Quiz q = new Quiz();
						q.setTitle(title);
						q.setIsPublic(!title.equals("quiz c"));
						q.setCreatorId(tempId);
						q.setImageUrl("https://images.immediate.co.uk/production/volatile/sites/3/2018/04/Screen-Shot-2018-04-05-at-09.20.50-96984e5.png");
						q.setDescription(String.format("This quiz is called %s and it is just an example, this text should be the description of the quiz", title));

						QuizAnswer ans = new QuizAnswer();
						ans.setContent("answer x");
						ans.setIsCorrect(true);

						q.addQuizAnswer(ans);

						quizService.create(q);
					});
			userRepository.findAll().forEach(System.out::println);
			System.out.println("---------------------------");
			quizService.readAll().forEach(System.out::println);
		};
	}
}
