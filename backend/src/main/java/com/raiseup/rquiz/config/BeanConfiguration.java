package com.raiseup.rquiz.config;

import com.raiseup.rquiz.models.db.Quiz;
import com.raiseup.rquiz.models.db.QuizAnswer;
import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import com.raiseup.rquiz.services.QuizService;
import com.raiseup.rquiz.services.UserService;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.stream.Stream;

@Configuration
public class BeanConfiguration {
    @Value("${rquiz.shouldSeedDatabase}")
    private boolean shouldSeedDatabase;

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
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
                        try{
                            User user = new User();
                            user.setUsername(name);
                            user.setPassword("123");
                            userService.create(user);
                        }catch (Exception ex){
                            System.err.println(String.format("Cannot create user. error: %s",
                                    ExceptionUtils.getStackTrace(ex)));
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

                        ans = new QuizAnswer();
                        ans.setContent("answer y");
                        ans.setIsCorrect(false);

                        q.addQuizAnswer(ans);

                        quizService.create(q);
                    });
            userRepository.findAll().forEach(System.out::println);
            System.out.println("---------------------------");
            quizService.readAll().forEach(System.out::println);
        };
    }
}
