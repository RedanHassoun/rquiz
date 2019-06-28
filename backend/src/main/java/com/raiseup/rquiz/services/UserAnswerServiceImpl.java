package com.raiseup.rquiz.services;

import com.raiseup.rquiz.exceptions.QuizNotFoundException;
import com.raiseup.rquiz.exceptions.UserNotFoundException;
import com.raiseup.rquiz.models.ApplicationUser;
import com.raiseup.rquiz.models.Quiz;
import com.raiseup.rquiz.models.QuizAnswer;
import com.raiseup.rquiz.models.UserAnswer;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import com.raiseup.rquiz.repo.UserAnswerRepository;
import com.raiseup.rquiz.repo.QuizRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserAnswerServiceImpl implements UserAnswerService {
    private Logger logger = LoggerFactory.getLogger(UserAnswerServiceImpl.class);
    private UserAnswerRepository userAnswerRepository;
    private QuizRepository quizRepository;
    private ApplicationUserRepository applicationUserRepository;

    public UserAnswerServiceImpl(UserAnswerRepository userAnswerRepository,
                                 QuizRepository quizRepository,
                                 ApplicationUserRepository applicationUserRepository){
        this.userAnswerRepository = userAnswerRepository;
        this.quizRepository = quizRepository;
        this.applicationUserRepository = applicationUserRepository;
    }

    @Override
    public UserAnswer create(String quizId, String userId, QuizAnswer quizAnswer)
                                                     throws QuizNotFoundException,
                                                            UserNotFoundException{
        if(quizId == null || userId == null || quizAnswer == null){
            final String errorMsg = String.format("Bad input: quizId=%s, userId=%s, userAnswer=%s",
                                            quizId,
                                            userId,
                                            quizAnswer.toString());
            this.logger.error(errorMsg);
            throw new NullPointerException(errorMsg);
        }

        UserAnswer userAnswer = new UserAnswer();

        userAnswer.setQuizAnswer(quizAnswer);

        Optional<Quiz> quiz = this.quizRepository.findById(quizId);
        if(!quiz.isPresent()){
            final String errorMsg = String.format("Quiz %s was not found", quizId);
            this.logger.error(errorMsg);
            throw new QuizNotFoundException(errorMsg);
        }

        userAnswer.setQuiz(quiz.get());

        Optional<ApplicationUser> user = this.applicationUserRepository.findById(userId);
        if(!user.isPresent()){
            final String errorMsg = String.format("user %s was not found", userId);
            this.logger.error(errorMsg);
            throw new UserNotFoundException(errorMsg);
        }

        userAnswer.setUser(user.get());

        return this.userAnswerRepository.save(userAnswer);
    }
}
