package com.raiseup.rquiz.config;

import com.raiseup.rquiz.models.db.Quiz;
import com.raiseup.rquiz.models.db.QuizAnswer;
import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import com.raiseup.rquiz.services.QuizService;
import com.raiseup.rquiz.services.UserService;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.stream.Stream;

@Configuration
public class BeanConfiguration {

    private final Logger logger;

    @Value("${rquiz.shouldSeedDatabase}")
    private boolean shouldSeedDatabase;

    public BeanConfiguration(Logger logger) {
        this.logger = logger;
    }

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
                            user.setEmail(String.format("%s@mail.com", name));
                            userService.create(user);
                            user.setImageUrl("https://www.hindustantimes.com/rf/image_size_960x540/HT/p2/2018/09/27/Pictures/_0ab52210-c22f-11e8-ac2f-8b6cbdfc246f.PNG");
                            userService.update(user);
                        }catch (Exception ex){
                            this.logger.error(String.format("Cannot create user. error: %s",
                                    ExceptionUtils.getStackTrace(ex)));
                        }
                    });
            final String tempId = userRepository.findAll().get(0).getId();
            final User creator = userRepository.findAll().get(0);
            Stream.of("quiz a", "quiz b", "quiz c", "quiz d", "quiz e", "quiz f", "quiz g", "quiz k", "quiz l", "quiz m", "quiz n", "quiz o",
                    "quiz a", "quiz b", "quiz c", "quiz d", "quiz e", "quiz f", "quiz g", "quiz k", "quiz l", "quiz m", "quiz n", "quiz o", "quiz v")
                    .forEach(title -> {
                        Quiz q = new Quiz();
                        q.setTitle(title);
                        q.setIsPublic(!title.equals("quiz c"));
                        q.setImageUrl("https://images.immediate.co.uk/production/volatile/sites/3/2018/04/Screen-Shot-2018-04-05-at-09.20.50-96984e5.png");
                        q.setDescription(String.format("This quiz is called %s and it is just an example, this text should be the description of the quiz", title));
                        q.setCreator(creator);
                        QuizAnswer ans = new QuizAnswer();
                        ans.setContent("answer x");
                        ans.setIsCorrect(true);

                        q.addQuizAnswer(ans);

                        ans = new QuizAnswer();
                        ans.setContent("answer y");
                        ans.setIsCorrect(false);

                        q.addQuizAnswer(ans);

                        try{
                            quizService.create(q);
                        }catch (Exception ex){
                            this.logger.error(String.format("Cannot create quiz %s, error: %s",
                                    title, ExceptionUtils.getStackTrace(ex)));
                        }
                    });
            this.logger.info("Users:");
            userRepository.findAll().forEach(user -> this.logger.info(user.toString()));
            this.logger.info("---------------------------");
            this.logger.info("Quiz:");
            quizService.readAll().forEach(quiz -> this.logger.info(quiz.toString()));
        };
    }
}
